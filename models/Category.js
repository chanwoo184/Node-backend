const mongoose = require('mongoose');

/**
 * @typedef Category
 * @property {string} name - 카테고리의 이름 (고유해야 함).
 * @property {string} [description] - 카테고리에 대한 설명.
 */

/**
 * Category Schema
 * @type {mongoose.Schema<Category>}
 */
const categorySchema = new mongoose.Schema({
  /**
   * 카테고리의 이름
   * @type {string}
   * @required
   * @unique
   */
  name: { type: String, required: true, unique: true },
  
  /**
   * 카테고리에 대한 설명
   * @type {string}
   * @optional
   */
  description: { type: String },
});

/**
 * Category 모델
 * @typedef {mongoose.Model<Category>} CategoryModel
 */
module.exports = mongoose.model('Category', categorySchema);
