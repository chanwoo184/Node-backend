// routes/userRoutes.js
const express = require('express');
const { getUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 사용자 관련 API
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: 회원 정보 조회
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자의 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: 인증 토큰이 없거나 유효하지 않음
 *       404:
 *         description: 사용자를 찾을 수 없음
 */
router.get('/me', protect, getUser);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: 회원 정보 수정
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             username: "newusername"
 *             email: "newemail@example.com"
 *             password: "newpassword123"
 *     responses:
 *       200:
 *         description: 회원 정보 수정 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: 잘못된 입력 데이터
 *       401:
 *         description: 인증 토큰이 없거나 유효하지 않음
 *       404:
 *         description: 사용자를 찾을 수 없음
 */
router.put('/me', protect, updateUser);

/**
 * @swagger
 * /api/users/me:
 *   delete:
 *     summary: 회원 탈퇴
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 회원 탈퇴 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: 인증 토큰이 없거나 유효하지 않음
 *       404:
 *         description: 사용자를 찾을 수 없음
 */
router.delete('/me', protect, deleteUser);

module.exports = router;
