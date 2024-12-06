// routes/authRoutes.js
const express = require('express');
const { register, login, logout, refreshToken } = require('../controllers/authController');
const validate = require('../middleware/validationMiddleware'); // 유효성 검증 미들웨어
const {
  registerSchema,
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
} = require('../middleware/roleMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 인증 관련 API
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 회원 가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             username: "testuser"
 *             email: "testuser@example.com"
 *             password: "password123"
 *     responses:
 *       201:
 *         description: 회원 가입 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: 이미 존재하는 이메일 또는 유효성 검증 실패
 *       500:
 *         description: 서버 에러
 */
router.post('/register', validate(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             email: "testuser@example.com"
 *             password: "password123"
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: 이메일 또는 비밀번호 불일치 또는 유효성 검증 실패
 *       500:
 *         description: 서버 에러
 */
router.post('/login', validate(loginSchema), login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 로그아웃
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *           example:
 *             refreshToken: "your_refresh_token_here"
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: 유효하지 않은 토큰 또는 유효성 검증 실패
 *       500:
 *         description: 서버 에러
 */
router.post('/logout', validate(logoutSchema), logout);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: 토큰 갱신
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *           example:
 *             refreshToken: "your_refresh_token_here"
 *     responses:
 *       200:
 *         description: 새로운 Access Token 발급
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: 유효하지 않은 토큰 또는 유효성 검증 실패
 *       500:
 *         description: 서버 에러
 */
router.post('/refresh-token', validate(refreshTokenSchema), refreshToken);

module.exports = router;
