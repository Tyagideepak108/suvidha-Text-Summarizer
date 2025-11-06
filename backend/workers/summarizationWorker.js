const { Worker } = require('bullmq');
const { Article, Summary } = require('../models');
const { saveToCache } = require('../middleware/cache');
const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
};

// Worker to process summarization jobs
const worker = new Worker('summarization-queue', async (job) => {
  console.log(` Processing job ${job.id}...`);
  
  const { articleId, original_text, userId, cacheKey } = job.data;

  try {
    // Update progress
    await job.updateProgress(10);

    // Generate summary using Hugging Face with multiple model fallbacks
    let summaryText;
    const models = [
      'facebook/bart-large-cnn',
      'sshleifer/distilbart-cnn-12-6',
      'google/pegasus-xsum'
    ];

    await job.updateProgress(30);

    let modelWorked = false;
    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`);
        const result = await hf.summarization({
          model: model,
          inputs: original_text,
          parameters: {
            max_length: 130,
            min_length: 30,
            do_sample: false
          }
        });
        summaryText = result.summary_text;
        modelWorked = true;
        console.log(`Success with model: ${model}`);
        break;
      } catch (aiError) {
        console.error(`Model ${model} failed:`, aiError.message);
      }
    }

    await job.updateProgress(70);

    // Simple extractive summary fallback
    if (!modelWorked) {
      const sentences = original_text.match(/[^.!?]+[.!?]+/g) || [original_text];
      const topSentences = sentences.slice(0, Math.min(3, sentences.length));
      summaryText = topSentences.join(' ').trim();
    }

    // Save summary to database
    const summary = await Summary.create({
      summary_text: summaryText,
      articleId: articleId,
      userId: userId
    });

    await job.updateProgress(90);

    const responseData = {
      id: summary.id,
      summary_text: summary.summary_text,
      articleId: articleId,
      original_text: original_text
    };

    // Save to cache if cacheKey exists
    if (cacheKey) {
      await saveToCache(cacheKey, responseData, 3600);
    }

    await job.updateProgress(100);

    console.log(`Job ${job.id} completed successfully`);

    return responseData;
  } catch (error) {
    console.error(` Job ${job.id} failed:`, error.message);
    throw error;
  }
}, { connection });

// Worker event listeners
worker.on('completed', (job) => {
  console.log(` Job ${job.id} has been completed`);
});

worker.on('failed', (job, err) => {
  console.error(` Job ${job.id} has failed with error: ${err.message}`);
});

worker.on('error', (err) => {
  console.error('Worker error:', err);
});

console.log(' Summarization worker started and listening for jobs...');

module.exports = worker;
