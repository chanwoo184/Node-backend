// middleware/errorHandler.js
const { CustomError } = require('../utils/customError');

const errorHandler = (err, req, res, next) => {
  console.error(err); // 개발 환경에서는 콘솔에 에러 로그 출력

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
