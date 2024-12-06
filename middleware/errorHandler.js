// middleware/errorHandler.js
// 로깅 시스템 구축 
const { CustomError } = require('../utils/customError');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // 에러 로깅
  if (err instanceof CustomError) {
    logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  } else {
    logger.error(`500 - 서버 에러 - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  }

  if (err instanceof CustomError) {
    // 커스텀 에러인 경우
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Mongoose 유효성 검증 에러
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join('. '),
    });
  }

  // JWT 에러
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: '유효하지 않은 토큰입니다.',
    });
  }

  // 기본 서버 에러
  res.status(500).json({
    success: false,
    message: '서버 에러가 발생했습니다.',
  });
};

module.exports = errorHandler;
