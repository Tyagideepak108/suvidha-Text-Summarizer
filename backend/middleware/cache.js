const redis = require('../config/redis');
const crypto = require('crypto');

// Generate cache key from text
const generateCacheKey = (text) => {
  const hash = crypto.createHash('md5').update(text.trim().toLowerCase()).digest('hex');
  return `summary:${hash}`;
};

// Cache middleware
const cacheMiddleware = async (req, res, next) => {
  try {
    const { original_text } = req.body;
    
    if (!original_text) {
      return next();
    }

    const cacheKey = generateCacheKey(original_text);
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log('✅ Cache HIT:', cacheKey);
      return res.status(200).json({
        message: 'Summary retrieved from cache!',
        cached: true,
        summary: JSON.parse(cachedData)
      });
    }

    console.log('❌ Cache MISS:', cacheKey);
    req.cacheKey = cacheKey;
    next();
  } catch (error) {
    console.error('Cache middleware error:', error);
    next();
  }
};

// Save to cache
const saveToCache = async (cacheKey, data, expiryInSeconds = 3600) => {
  try {
    await redis.setex(cacheKey, expiryInSeconds, JSON.stringify(data));
    console.log('💾 Saved to cache:', cacheKey);
  } catch (error) {
    console.error('Cache save error:', error);
  }
};

module.exports = { cacheMiddleware, saveToCache };
