const mongoose = require('mongoose');

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
  salary: String,
  createdAt: { type: Date, default: Date.now },
});

// 고유 인덱스 설정
jobSchema.index({ link: 1 }, { unique: true });
jobSchema.index({ company: 1 });
jobSchema.index({ sector: 1 });
jobSchema.index({ skills: 1 });

module.exports = mongoose.model('Job', jobSchema);
