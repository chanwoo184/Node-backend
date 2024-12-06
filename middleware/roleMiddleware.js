// validators/authValidator.js
const Joi = require('joi');

// 회원 가입 유효성 검증 스키마
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    'string.base': `"username"은 문자열이어야 합니다.`,
    'string.empty': `"username"은 비어 있을 수 없습니다.`,
    'string.min': `"username"은 최소 3자 이상이어야 합니다.`,
    'string.max': `"username"은 최대 30자 이하여야 합니다.`,
    'any.required': `"username"은 필수 항목입니다.`
  }),
  email: Joi.string().email().required().messages({
    'string.base': `"email"은 문자열이어야 합니다.`,
    'string.email': `"email"은 유효한 이메일 주소여야 합니다.`,
    'string.empty': `"email"은 비어 있을 수 없습니다.`,
    'any.required': `"email"은 필수 항목입니다.`
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': `"password"는 문자열이어야 합니다.`,
    'string.empty': `"password"는 비어 있을 수 없습니다.`,
    'string.min': `"password"는 최소 6자 이상이어야 합니다.`,
    'any.required': `"password"는 필수 항목입니다.`
  }),
});

// 로그인 유효성 검증 스키마
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': `"email"은 문자열이어야 합니다.`,
    'string.email': `"email"은 유효한 이메일 주소여야 합니다.`,
    'string.empty': `"email"은 비어 있을 수 없습니다.`,
    'any.required': `"email"은 필수 항목입니다.`
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': `"password"는 문자열이어야 합니다.`,
    'string.empty': `"password"는 비어 있을 수 없습니다.`,
    'string.min': `"password"는 최소 6자 이상이어야 합니다.`,
    'any.required': `"password"는 필수 항목입니다.`
  }),
});

// 로그아웃 유효성 검증 스키마
const logoutSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.base': `"refreshToken"은 문자열이어야 합니다.`,
    'string.empty': `"refreshToken"은 비어 있을 수 없습니다.`,
    'any.required': `"refreshToken"은 필수 항목입니다.`
  }),
});

// 토큰 갱신 유효성 검증 스키마
const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.base': `"refreshToken"은 문자열이어야 합니다.`,
    'string.empty': `"refreshToken"은 비어 있을 수 없습니다.`,
    'any.required': `"refreshToken"은 필수 항목입니다.`
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
};
