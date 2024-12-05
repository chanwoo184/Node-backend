const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  bookmarkedAt: { type: Date, default: Date.now },
});

// 인덱스 설정
bookmarkSchema.index({ user: 1 });
bookmarkSchema.index({ job: 1 });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
