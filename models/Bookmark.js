// models/Bookmark.js
const mongoose = require('mongoose');

/**
 * 북마크 스키마
 * 
 * 사용자가 관심 있는 공고를 북마크로 저장하는 모델입니다.
 * 사용자와 공고의 조합을 고유하게 설정하여 동일한 공고를 중복 북마크하는 것을 방지합니다.
 * 
 * @module models/Bookmark
 */

/**
 * @typedef {Object} Bookmark
 * @property {mongoose.Schema.Types.ObjectId} user - 북마크를 저장한 사용자 (User 모델 참조)
 * @property {mongoose.Schema.Types.ObjectId} job - 북마크된 공고 (Job 모델 참조)
 * @property {Date} createdAt - 북마크 생성일 (자동 생성)
 * @property {Date} updatedAt - 북마크 업데이트일 (자동 생성)
 */

// 북마크 스키마 정의
const bookmarkSchema = new mongoose.Schema({
  /**
   * 북마크를 저장한 사용자 (User 모델 참조)
   * @type {mongoose.Schema.Types.ObjectId}
   * @required
   */
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  /**
   * 북마크된 공고 (Job 모델 참조)
   * @type {mongoose.Schema.Types.ObjectId}
   * @required
   */
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
}, {
  /**
   * 타임스탬프 옵션
   * 자동으로 createdAt 및 updatedAt 필드를 추가합니다.
   */
  timestamps: true,
});

/**
 * 사용자와 공고의 조합을 고유하게 설정하여 중복 북마크를 방지합니다.
 * @type {Object}
 */
bookmarkSchema.index({ user: 1, job: 1 }, { unique: true }); // 사용자와 공고의 조합을 고유하게 설정

/**
 * 북마크 모델
 * @type {mongoose.Model<Bookmark>}
 */
module.exports = mongoose.model('Bookmark', bookmarkSchema);
