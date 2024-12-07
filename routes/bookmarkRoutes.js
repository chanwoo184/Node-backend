// routes/bookmarkRoutes.js
const express = require('express');
const router = express.Router();
const { toggleBookmark, getBookmarks } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Bookmarks
 *   description: 북마크 관리 API
 */

/**
 * @swagger
 * /api/bookmarks/toggle/{jobId}:
 *   post:
 *     summary: 채용 공고 북마크 토글 (추가/제거)
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         schema:
 *           type: string
 *         required: true
 *         description: 북마크할 채용 공고의 ID
 *     responses:
 *       201:
 *         description: 북마크 추가 완료
 *       200:
 *         description: 북마크 제거 완료
 *       400:
 *         description: 잘못된 요청 또는 이미 북마크된 공고
 *       404:
 *         description: 채용 공고를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.post('/toggle/:jobId', protect, toggleBookmark);

/**
 * @swagger
 * /api/bookmarks:
 *   get:
 *     summary: 내 북마크 목록 조회
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, jobTitle]
 *           default: createdAt
 *         description: 정렬 기준
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: 정렬 순서
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: 지역별 필터링
 *       - in: query
 *         name: experience
 *         schema:
 *           type: string
 *         description: 경력별 필터링
 *       - in: query
 *         name: salaryMin
 *         schema:
 *           type: number
 *         description: 최소 급여
 *       - in: query
 *         name: salaryMax
 *         schema:
 *           type: number
 *         description: 최대 급여
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *         description: 기술스택별 필터링 (쉼표로 구분)
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 키워드 검색
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *         description: 회사명 검색
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *         description: 포지션 검색
 *     responses:
 *       200:
 *         description: 북마크 목록 반환
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 에러
 */
router.get('/', protect, getBookmarks);

module.exports = router;
