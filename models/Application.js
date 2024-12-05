const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  status: { type: String, enum: ['applied', 'interview', 'offer', 'rejected'], default: 'applied' },
  appliedAt: { type: Date, default: Date.now },
  resume: { type: String }, // 파일 경로 또는 URL
  coverLetter: { type: String },
});

// 인덱스 설정
applicationSchema.index({ user: 1 });
applicationSchema.index({ job: 1 });

module.exports = mongoose.model('Application', applicationSchema);
