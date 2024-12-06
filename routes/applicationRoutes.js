// routes/applicationRoutes.js
const express = require('express');
const { 
  applyJob, cancelApplication, getApplications, 
  bookmarkJob, unbookmarkJob, getBookmarks 
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: 지원 및 관심 관련 API
 */

/**
 * @swagger
 * /api/applications/apply/{jobId}:
 *   post:
 *     summary: 지원하기
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: 지원할 채용 공고 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resume
 *             properties:
 *               resume:
 *                 type: string
 *                 format: uri
 *               coverLetter:
 *                 type: string
 *           example:
 *             resume: "https://www.example.com/resume.pdf"
 *             coverLetter: "저는 백엔드 개발에 열정을 가지고 있습니다..."
 *     responses:
 *       201:
 *         description: 지원 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 application:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: 이미 지원한 공고이거나 잘못된 입력 데이터
 *       401:
 *         description: 인증 토큰이 없거나 유효하지 않음
 *       404:
 *         description: 채용 공고를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.post('/apply/:jobId', protect, applyJob);

/**
 * @swagger
 * /api/applications/cancel/{applicationId}:
 *   delete:
 *     summary: 지원 취소
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: 취소할 지원 내역 ID
 *     responses:
 *       200:
 *         description: 지원 취소 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: 인증 토큰이 없거나 유효하지 않음
 *       403:
 *         description: 권한이 없음
 *       404:
 *         description: 지원 내역을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.delete('/cancel/:applicationId', protect, cancelApplication);

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: 지원 내역 조회
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자의 모든 지원 내역 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       401:
 *         description: 인증 토큰이 없거나 유효하지 않음
 *       500:
 *         description: 서버 에러
 */
router.get('/', protect, getApplications);

/**
 * @swagger
 * /api/applications/bookmark/{jobId}:
 *   post:
 *     summary: 관심 등록
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: 관심 등록할 채용 공고 ID
 *     responses:
 *       201:
 *         description: 관심 등록 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 application:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: 이미 관심 등록된 공고이거나 잘못된 입력 데이터
 *       401:
 *         description: 인증 토큰이 없거나 유효하지 않음
 *       404:
 *         description: 채용 공고를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.post('/bookmark/:jobId', protect, bookmarkJob);

/**
 * @swagger
 * /api/applications/bookmark/{jobId}:
 *   delete:
 *     summary: 관심 등록 취소
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: 관심 등록 취소할 채용 공고 ID
 *     responses:
 *       200:
 *         description: 관심 등록 취소 완료
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
 *         description: 관심 등록된 공고를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.delete('/bookmark/:jobId', protect, unbookmarkJob);

/**
 * @swagger
 * /api/applications/bookmarks:
 *   get:
 *     summary: 관심 목록 조회
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자의 모든 관심 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       401:
 *         description: 인증 토큰이 없거나 유효하지 않음
 *       500:
 *         description: 서버 에러
 */
router.get('/bookmarks', protect, getBookmarks);

// 그 외 추가 API는 필요에 따라 구현

module.exports = router;
