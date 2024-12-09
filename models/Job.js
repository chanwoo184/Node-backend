// models/Job.js
const mongoose = require('mongoose');

/**
 * @typedef Job
 * @property {string} title - 채용 공고의 제목 (필수).
 * @property {mongoose.Schema.Types.ObjectId} company - 참조된 회사의 ID (필수).
 * @property {string} link - 채용 공고의 고유 URL (필수, 고유).
 * @property {string} [location] - 채용 공고의 위치.
 * @property {string} [experience] - 요구되는 경력 수준.
 * @property {string} [education] - 요구되는 학력 수준.
 * @property {string} [employmentType] - 고용 형태 (예: 정규직, 계약직 등).
 * @property {Date} [deadline] - 지원 마감일.
 * @property {mongoose.Schema.Types.ObjectId} [sector] - 참조된 카테고리의 ID.
 * @property {mongoose.Schema.Types.ObjectId[]} [skills] - 참조된 기술 스택의 ID 목록.
 * @property {number} [salary] - 급여 정보.
 * @property {number} [views=0] - 공고 조회수.
 * @property {Date} createdAt - 채용 공고가 생성된 날짜.
 */

/**
 * Job Schema
 * @type {mongoose.Schema<Job>}
 */
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  link: { type: String, required: true, unique: true },
  location: String,
  experience: String,
  education: String,
  employmentType: String,
  deadline: {
    type: Date,
    validate: {
      validator: function(v) {
        return v instanceof Date && !isNaN(v);
      },
      message: props => `${props.value}은(는) 유효한 날짜가 아닙니다!`,
    },
  },
  sector: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  salary: { type: String }, // 수정된 부분: String에서 Number로 변경
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// 인덱스 설정
jobSchema.index({ link: 1 }, { unique: true });
jobSchema.index({ company: 1 });
jobSchema.index({ sector: 1 });
jobSchema.index({ skills: 1 });

module.exports = mongoose.model('Job', jobSchema);
