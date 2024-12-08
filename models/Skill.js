const mongoose = require('mongoose');

/**
 * @typedef Skill
 * @property {string} name - 기술의 이름 (고유해야 함).
 * @property {string} [description] - 기술에 대한 설명.
 */

/**
 * Skill Schema
 * @type {mongoose.Schema<Skill>}
 */
const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});

// 고유 인덱스 설정 (이미 unique: true 설정이 되어 있으므로 중복 불가능)
skillSchema.index({ name: 1 }, { unique: true });

/**
 * Skill 모델
 * @typedef {mongoose.Model<Skill>} SkillModel
 */
module.exports = mongoose.model('Skill', skillSchema);
