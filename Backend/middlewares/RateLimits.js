const hits = new Map();

export function rateLimit({ windowMs = 10000, max = 15 } = {}) {
  return (req, res, next) => {
    const key = req.user ? `u:${req.user._id}` : `ip:${req.ip}`;
    const now = Date.now();
    const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
    arr.push(now);
    hits.set(key, arr);
    
    if (arr.length > max) {
      return res.status(429).json({ message: "Too many requests. Slow down." });
    }
    
    next();
  };
}