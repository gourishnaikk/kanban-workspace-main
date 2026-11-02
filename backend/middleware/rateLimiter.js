const rateLimit = require("express-rate-limit");

// General API Rate Limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per 15 mins per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});

// Authentication Rate Limiter (Protects login & registration from brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per 15 mins per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts from this IP, please try again after 15 minutes",
  },
});

// Strict Limiter for testing / demonstrating 429 Too Many Requests
const testLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Triggers 429 on the 6th request within 1 minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Rate limit exceeded: Too many requests, please slow down and try again shortly",
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
  testLimiter,
};
