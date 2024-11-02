import rateLimit from "express-rate-limit";

// Set up rate limit
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 2, // Limit each IP to 2 requests per `window` (here, per minute)
  message: {
    success: false,
    message: "Too many requests, please try again after sometime",
    data: null,
    status: 429,
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export default apiLimiter;
