// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * @typedef {Object} User
 * @property {string} _id - 사용자 고유 ID
 * @property {string} username - 사용자 이름
 * @property {string} email - 사용자 이메일
 * @property {string} password - 사용자 비밀번호 (해싱됨)
 * @property {string} role - 사용자 역할 (user, admin)
 * @property {Array} refreshTokens - 사용자 Refresh Token 목록
 */

/**
 * 사용자 스키마 정의
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '사용자 이름을 입력하세요'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, '이메일을 입력하세요'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, '비밀번호를 입력하세요'],
    minlength: [6, '비밀번호는 최소 6자 이상이어야 합니다'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  refreshTokens: [{
    token: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

// 비밀번호 해싱
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * 비밀번호 비교 메소드
 * @param {string} enteredPassword - 입력된 비밀번호
 * @returns {boolean} - 비밀번호 일치 여부
 */
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
