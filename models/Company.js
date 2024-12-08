// models/Company.js
const mongoose = require('mongoose');

/**
 * @typedef Company
 * @property {string} name - 회사의 이름 (고유해야 함).
 * @property {string} [website] - 회사의 웹사이트 URL.
 * @property {string} [location] - 회사의 위치.
 * @property {string} [industry] - 회사가 속한 산업 분야.
 * @property {string} [description] - 회사에 대한 설명.
 * @property {Date} createdAt - 회사 정보가 생성된 날짜.
 */

/**
 * Company Schema
 * @type {mongoose.Schema<Company>}
 */
const companySchema = new mongoose.Schema({
  /**
   * 회사의 이름
   * @type {string}
   * @required
   * @unique
   */
  name: { type: String, required: true, unique: true },
  
  /**
   * 회사의 웹사이트 URL
   * @type {string}
   * @optional
   */
  website: { type: String },
  
  /**
   * 회사의 위치
   * @type {string}
   * @optional
   */
  location: { type: String },
  
  /**
   * 회사가 속한 산업 분야
   * @type {string}
   * @optional
   */
  industry: { type: String },
  
  /**
   * 회사에 대한 설명
   * @type {string}
   * @optional
   */
  description: { type: String },
  
  /**
   * 회사 정보가 생성된 날짜
   * @type {Date}
   * @default {Date.now}
   */
  createdAt: { type: Date, default: Date.now },
});

/**
 * Company 모델
 * @typedef {mongoose.Model<Company>} CompanyModel
 */
module.exports = mongoose.model('Company', companySchema);
