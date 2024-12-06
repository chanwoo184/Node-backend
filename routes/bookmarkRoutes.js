// routes/bookmarkRoutes.js
const express = require('express');
const { bookmarkJob, unbookmarkJob, getBookmarks } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bookmarks
 *   description: 북마크 관련 API
 */

/**
 * @swagger
 * /api/bookmarks/bookmark/{jobId}:
 *   post:
 *     summary: 관심 등록
 *     tags: [Bookmarks]
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
 *               $ref: '#/components/schemas/Bookmark'
 *       400:
 *         description: 이미 관심 등록된 공고
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
 * /api/bookmarks/bookmark/{jobId}:
 *   delete:
 *     summary: 관심 등록 취소
 *     tags: [Bookmarks]
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
 * /api/bookmarks:
 *   get:
 *     summary: 관심 목록 조회
 *     tags: [Bookmarks]
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
 *                 $ref: '#/components/schemas/Bookmark'
 *       401:
 *         description: 인증 토큰이 없거나 유효하지 않음
 *       500:
 *         description: 서버 에러
 */
router.get('/', protect, getBookmarks);

module.exports = router;
