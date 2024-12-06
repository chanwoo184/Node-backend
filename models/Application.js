const mongoose = require('mongoose');

/**
 * @typedef {Object} Application
 * @property {string} user - 지원자 ID (User)
 * @property {string} job - 채용 공고 ID (Job)
 * @property {string} resume - 이력서 경로 또는 URL
 * @property {string} coverLetter - 자기소개서
 * @property {string} status - 지원 상태 (대기중, 진행중, 완료, 취소됨, 관심등록)
 */

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  status: { type: String, enum: ['대기중', '진행중', '완료', '취소됨'], default: '대기중' },
  appliedAt: { type: Date, default: Date.now },
  resume: { type: String }, // 파일 경로 또는 URL
  coverLetter: { type: String },
});

// 인덱스 설정
applicationSchema.index({ user: 1 });
applicationSchema.index({ job: 1 });

module.exports = mongoose.model('Application', applicationSchema);
