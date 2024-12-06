// models/Bookmark.js
const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '사용자를 지정하세요'],
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, '채용 공고를 지정하세요'],
    unique: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);
