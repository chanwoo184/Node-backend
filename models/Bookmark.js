// models/Bookmark.js
const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
}, {
  timestamps: true,
});

// 사용자와 공고의 조합을 고유하게 설정하여 중복 북마크 방지
bookmarkSchema.index({ user: 1, job: 1 }, { unique: true }); // 사용자와 공고의 조합을 고유하게 설정

module.exports = mongoose.model('Bookmark', bookmarkSchema);
