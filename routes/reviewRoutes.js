// routes/reviewRoutes.js
const express = require('express');
const { createReview, getReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: 리뷰 관련 API
 */

/**
 * @swagger
 * /api/reviews/{jobId}:
 *   post:
 *     summary: 리뷰 작성
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: 리뷰를 작성할 채용 공고 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               feedback:
 *                 type: string
 *           example:
 *             rating: 5
 *             feedback: "훌륭한 회사입니다!"
 *     responses:
 *       201:
 *         description: 리뷰 작성 완료
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: 잘못된 입력 데이터
 *       401:
 *         description: 인증 토큰이 없거나 유효하지 않음
 *       404:
 *         description: 채용 공고를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.post('/:jobId', protect, createReview);

/**
 * @swagger
 * /api/reviews/{jobId}:
 *   get:
 *     summary: 특정 채용 공고의 리뷰 조회
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: 리뷰를 조회할 채용 공고 ID
 *     responses:
 *       200:
 *         description: 해당 채용 공고의 모든 리뷰 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: 채용 공고를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.get('/:jobId', getReviews);

module.exports = router;
