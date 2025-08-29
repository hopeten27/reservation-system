const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const cacheMiddleware = (duration = CACHE_TTL) => {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl;
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < duration) {
      return res.json(cached.data);
    }

    const originalJson = res.json;
    res.json = function(data) {
      cache.set(key, {
        data,
        timestamp: Date.now()
      });
      
      // Clean old cache entries
      if (cache.size > 100) {
        const entries = Array.from(cache.entries());
        entries.slice(0, 50).forEach(([k]) => cache.delete(k));
      }
      
      return originalJson.call(this, data);
    };

    next();
  };
};