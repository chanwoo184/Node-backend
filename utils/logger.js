// utils/logger.js
// 로깅 시스템 구축 
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// 사용자 정의 로그 포맷
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// 로거 생성
const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    // 콘솔 로그 (개발 환경에서만)
    new transports.Console({
      format: combine(
        colorize(),
        timestamp(),
        myFormat
      ),
      silent: process.env.NODE_ENV === 'production', // 프로덕션에서는 콘솔 로그 비활성화
    }),
    // 파일 로그
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// 개발 환경에서만 파일 로그 사용
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(
      colorize(),
      timestamp(),
      myFormat
    )
  }));
}

module.exports = logger;
