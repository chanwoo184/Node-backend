// controllers/authController.js
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const jwt = require('jsonwebtoken');

// 회원 가입
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 기존 사용자 확인
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    user = new User({ username, email, password });
    await user.save();

    // Access Token 및 Refresh Token 생성
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Refresh Token 저장
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.status(201).json({
      message: '회원 가입 완료',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 로그인
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 사용자 확인
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }

    // 비밀번호 확인
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }

    // Access Token 및 Refresh Token 생성
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Refresh Token 저장
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.status(200).json({
      message: '로그인 성공',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 로그아웃
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh Token이 필요합니다.' });
    }

    // Refresh Token 검증
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: '유효하지 않은 토큰입니다.' });
    }

    // Refresh Token 제거
    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
    await user.save();

    res.status(200).json({ message: '로그아웃 성공' });
  } catch (error) {
    res.status(400).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

// 토큰 갱신
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh Token이 필요합니다.' });
    }

    // Refresh Token 검증
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: '유효하지 않은 토큰입니다.' });
    }

    // Refresh Token 존재 여부 확인
    if (!user.refreshTokens.find(rt => rt.token === refreshToken)) {
      return res.status(400).json({ message: '유효하지 않은 토큰입니다.' });
    }

    // 새로운 Access Token 생성
    const accessToken = generateAccessToken(user);

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(400).json({ message: '유효하지 않은 토큰입니다.' });
  }
};
