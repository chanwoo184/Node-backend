// middleware/loggerMiddleware.js
const morgan = require('morgan');
const logger = require('../utils/logger');

// morgan 포맷 설정
const stream = {
  write: (message) => logger.info(message.trim()),
};

// 성공적인 요청 로그
const requestLogger = morgan('combined', { stream });

// 실패한 요청 로그 (4xx, 5xx)
const errorLogger = morgan('combined', {
  skip: (req, res) => res.statusCode < 400,
  stream: {
    write: (message) => logger.error(message.trim()),
  },
});

module.exports = { requestLogger, errorLogger };
