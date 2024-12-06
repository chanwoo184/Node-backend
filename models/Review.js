// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '사용자를 지정하세요'],
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, '채용 공고를 지정하세요'],
  },
  rating: {
    type: Number,
    required: [true, '평점을 입력하세요'],
    min: 1,
    max: 5,
  },
  feedback: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Review', reviewSchema);
