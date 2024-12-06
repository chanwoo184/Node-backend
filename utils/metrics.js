// utils/metrics.js
// 모니터링 시스템 구축
const client = require('prom-client');

// 기본 메트릭 수집
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// 사용자 정의 메트릭 (예: HTTP 요청 수)
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: '총 HTTP 요청 수',
  labelNames: ['method', 'route', 'status'],
});

// 메트릭 노출 라우트
const metricsRouter = require('express').Router();

metricsRouter.get('/', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = { httpRequestCounter, metricsRouter };
