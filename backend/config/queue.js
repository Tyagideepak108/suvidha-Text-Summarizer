const { Queue } = require('bullmq');

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
};

// Create summarization queue
const summarizationQueue = new Queue('summarization-queue', { connection });

console.log('📋 Summarization queue initialized');

module.exports = { summarizationQueue };
