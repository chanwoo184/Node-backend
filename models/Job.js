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
 * @property {string} [salary] - 급여 정보.
 * @property {number} [views=0] - 공고 조회수.
 * @property {Date} createdAt - 채용 공고가 생성된 날짜.
 */

/**
 * Job Schema
 * @type {mongoose.Schema<Job>}
 */
const jobSchema = new mongoose.Schema({
  /**
   * 채용 공고의 제목
   * @type {string}
   * @required
   */
  title: { type: String, required: true },
  
  /**
   * 참조된 회사의 ID
   * @type {mongoose.Schema.Types.ObjectId}
   * @ref {Company}
   * @required
   */
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  
  /**
   * 채용 공고의 고유 URL
   * @type {string}
   * @required
   * @unique
   */
  link: { type: String, required: true, unique: true },
  
  /**
   * 채용 공고의 위치
   * @type {string}
   * @optional
   */
  location: String,
  
  /**
   * 요구되는 경력 수준
   * @type {string}
   * @optional
   */
  experience: String,
  
  /**
   * 요구되는 학력 수준
   * @type {string}
   * @optional
   */
  education: String,
  
  /**
   * 고용 형태 (예: 정규직, 계약직 등)
   * @type {string}
   * @optional
   */
  employmentType: String,
  
  /**
   * 지원 마감일
   * @type {Date}
   * @optional
   * @validate
   * - validator: 날짜 유효성 검사
   * - message: 유효하지 않은 날짜일 경우 메시지
   */
  deadline: {
    type: Date,
    validate: {
      validator: function(v) {
        return v instanceof Date && !isNaN(v);
      },
      message: props => `${props.value}은(는) 유효한 날짜가 아닙니다!`,
    },
  },
  
  /**
   * 참조된 카테고리의 ID
   * @type {mongoose.Schema.Types.ObjectId}
   * @ref {Category}
   * @optional
   */
  sector: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  
  /**
   * 참조된 기술 스택의 ID 목록
   * @type {mongoose.Schema.Types.ObjectId[]}
   * @ref {Skill}
   * @optional
   */
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  
  /**
   * 급여 정보
   * @type {string}
   * @optional
   */
  salary: String,
  
  /**
   * 공고 조회수
   * @type {number}
   * @default {0}
   * @optional
   */
  views: { type: Number, default: 0 }, // 조회수 필드 추가
  
  /**
   * 채용 공고가 생성된 날짜
   * @type {Date}
   * @default {Date.now}
   * @optional
   */
  createdAt: { type: Date, default: Date.now },
});

// 고유 인덱스 설정
jobSchema.index({ link: 1 }, { unique: true });
jobSchema.index({ company: 1 });
jobSchema.index({ sector: 1 });
jobSchema.index({ skills: 1 });

/**
 * Job 모델
 * @typedef {mongoose.Model<Job>} JobModel
 */
module.exports = mongoose.model('Job', jobSchema);
