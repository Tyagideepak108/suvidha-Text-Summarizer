// Cache disabled - Redis not available
const cacheMiddleware = async (req, res, next) => {
  next();
};

const saveToCache = async () => {
  // No-op
};

module.exports = { cacheMiddleware, saveToCache };
