// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// 회원 가입
exports.register = async (req, res) => {
  // 입력 데이터 검증
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    email:    Joi.string().email().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    // 사용자 존재 여부 확인
    const existingUser = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] });
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 사용자입니다.' });
    }

    // 사용자 생성
    const user = new User(req.body);
    await user.save();

    res.status(201).json({ message: '회원 가입 성공' });
  } catch(err) {
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
};

// 로그인
exports.login = async (req, res) => {
  // 입력 데이터 검증
  const schema = Joi.object({
    email:    Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    // 사용자 존재 여부 확인
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });

    // 비밀번호 비교
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) return res.status(400).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });

    // JWT 생성
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch(err) {
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
};
