// controllers/authController.js
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const {
  registerSchema,
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
} = require('../middleware/roleMiddleware');
const { BadRequestError, UnauthorizedError } = require('../utils/customError');

/**
 * @desc    회원 가입
 * @route   POST /api/auth/register
 * @access  Public
 * @param   {Object} req - Express request 객체
 * @param   {Object} res - Express response 객체
 * @param   {Function} next - Express next 미들웨어 함수
 * @returns {Object} - 회원 가입 성공 시 Access Token과 Refresh Token 반환
 */
exports.register = async (req, res, next) => {
  // 입력 데이터 검증
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }

  const { username, email, password } = req.body;

  try {
    // 기존 사용자 확인 및 등록
    let user = await User.findOne({ email });
    if (user) {
      return next(new BadRequestError('이미 존재하는 이메일입니다.'));
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
    next(error);
  }
};

/**
 * @desc    로그인
 * @route   POST /api/auth/login
 * @access  Public
 * @param   {Object} req - Express request 객체
 * @param   {Object} res - Express response 객체
 * @param   {Function} next - Express next 미들웨어 함수
 * @returns {Object} - 로그인 성공 시 Access Token과 Refresh Token 반환
 */
exports.login = async (req, res, next) => {
  // 입력 데이터 검증
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }

  const { email, password } = req.body;

  try {
    // 사용자 확인
    const user = await User.findOne({ email });
    if (!user) {
      return next(new UnauthorizedError('이메일 또는 비밀번호가 일치하지 않습니다.'));
    }

    // 비밀번호 확인
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new UnauthorizedError('이메일 또는 비밀번호가 일치하지 않습니다.'));
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
    next(error);
  }
};

/**
 * @desc    로그아웃
 * @route   POST /api/auth/logout
 * @access  Public
 * @param   {Object} req - Express request 객체
 * @param   {Object} res - Express response 객체
 * @param   {Function} next - Express next 미들웨어 함수
 * @returns {Object} - 로그아웃 성공 메시지 반환
 */
exports.logout = async (req, res, next) => {
  // 입력 데이터 검증
  const { error } = logoutSchema.validate(req.body);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }

  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      return next(new BadRequestError('Refresh Token이 필요합니다.'));
    }

    // Refresh Token 검증
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new BadRequestError('유효하지 않은 토큰입니다.'));
    }

    // Refresh Token 제거
    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
    await user.save();

    res.status(200).json({ message: '로그아웃 성공' });
  } catch (error) {
    next(new BadRequestError('유효하지 않은 토큰입니다.'));
  }
};

/**
 * @desc    토큰 갱신
 * @route   POST /api/auth/refresh-token
 * @access  Public
 * @param   {Object} req - Express request 객체
 * @param   {Object} res - Express response 객체
 * @param   {Function} next - Express next 미들웨어 함수
 * @returns {Object} - 새로운 Access Token 반환
 */
exports.refreshToken = async (req, res, next) => {
  // 입력 데이터 검증
  const { error } = refreshTokenSchema.validate(req.body);
  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }

  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      return next(new BadRequestError('Refresh Token이 필요합니다.'));
    }

    // Refresh Token 검증
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new BadRequestError('유효하지 않은 토큰입니다.'));
    }

    // Refresh Token 존재 여부 확인
    if (!user.refreshTokens.find(rt => rt.token === refreshToken)) {
      return next(new BadRequestError('유효하지 않은 토큰입니다.'));
    }

    // 새로운 Access Token 생성
    const accessToken = generateAccessToken(user);

    res.status(200).json({ accessToken });
  } catch (error) {
    next(new BadRequestError('유효하지 않은 토큰입니다.'));
  }
};
