const rateLimit = require("express-rate-limit");

exports.apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
