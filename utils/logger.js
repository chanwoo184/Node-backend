// utils/logger.js
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;
const { ElasticsearchTransport } = require('winston-elasticsearch');
const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({ node: 'http://localhost:9200' });
//ELK 스택을 설정하고 실행 중이어야 합니다. Elasticsearch는 기본적으로 http://localhost:9200에서 실행됩니다.
const esTransportOpts = {
  level: 'error',
  client: esClient,
  indexPrefix: 'logs', // 인덱스 접두사
};

const esTransport = new ElasticsearchTransport(esTransportOpts);

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
    // Elasticsearch 로그 (에러 수준만)
    esTransport,
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
