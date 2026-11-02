import rateLimit from 'express-rate-limit';

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000; // 15 mins
const maxWrites = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;

export const writeRateLimiter = rateLimit({
  windowMs,
  max: maxWrites,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      type: 'https://api.accessibleplace.org/errors/rate-limit-exceeded',
      title: 'Too Many Requests',
      status: 429,
      detail: `Rate limit of ${maxWrites} write requests per 15 minutes exceeded. Please try again later.`,
      instance: req.originalUrl
    });
  }
});

export const generalRateLimiter = rateLimit({
  windowMs,
  max: maxWrites * 5, // 500 reads per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      type: 'https://api.accessibleplace.org/errors/rate-limit-exceeded',
      title: 'Too Many Requests',
      status: 429,
      detail: 'General API request limit exceeded. Please slow down your requests.',
      instance: req.originalUrl
    });
  }
});

