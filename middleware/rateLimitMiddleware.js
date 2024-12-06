// middleware/rateLimitMiddleware.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100 요청
  message: '15분 내에 너무 많은 요청을 보냈습니다. 나중에 다시 시도하세요.',
});

module.exports = limiter;
