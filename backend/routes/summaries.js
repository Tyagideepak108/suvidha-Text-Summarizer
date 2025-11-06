const express = require('express');
const { Article, Summary } = require('../models');
const authenticateToken = require('../middleware/auth');
const { cacheMiddleware, saveToCache } = require('../middleware/cache');
const { summarizationQueue } = require('../config/queue');
const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const router = express.Router();

// /summaries route with direct processing (no queue)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { original_text } = req.body;
    const userId = req.user.userId;

    if (!original_text) {
      return res.status(400).json({ message: 'Original text is required!' });
    }

    const article = await Article.create({ original_text, userId });

    const result = await hf.summarization({
      model: 'facebook/bart-large-cnn',
      inputs: original_text,
      parameters: { max_length: 150, min_length: 30 }
    });

    const summary = await Summary.create({
      summary_text: result.summary_text,
      articleId: article.id,
      userId
    });

    res.status(200).json({
      message: 'Summary created successfully!',
      summary
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create summary!', error: error.message });
  }
});

// GET /summaries route 
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const summaries = await Summary.findAll({
      where: { userId },
      include: [{
        model: Article,
        attributes: ['original_text']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      message: 'Summaries retrieved successfully!',
      count: summaries.length,
      summaries
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get summaries!', error: error.message });
  }
});

// DELETE /summaries/:id route (must be before /job/:jobId)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const summary = await Summary.findOne({ where: { id, userId } });
    
    if (!summary) {
      return res.status(404).json({ message: 'Summary not found' });
    }

    const articleId = summary.articleId;
    await summary.destroy();
    
    if (articleId) {
      await Article.destroy({ where: { id: articleId, userId } });
    }
    
    res.status(200).json({ message: 'Summary deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete summary', error: error.message });
  }
});

// Get job status
router.get('/job/:jobId', authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await summarizationQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const state = await job.getState();
    const progress = job.progress;

    if (state === 'completed') {
      return res.json({
        status: 'completed',
        result: job.returnvalue
      });
    }

    if (state === 'failed') {
      return res.json({
        status: 'failed',
        error: job.failedReason
      });
    }

    res.json({
      status: state,
      progress
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get job status', error: error.message });
  }
});

module.exports = router;