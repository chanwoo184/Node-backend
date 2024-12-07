// routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  searchJobs,
  filterJobs,
  sortJobs,
  aggregateJobs,
  aggregateAverageSalaryByIndustry
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');
const paginationMiddleware = require('../middleware/paginationMiddleware'); // 페이지네이션 미들웨어

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: 채용 공고 관리 API
 */

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: 채용 공고 생성 (관리자 권한 필요)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               company:
 *                 type: string
 *               link:
 *                 type: string
 *               location:
 *                 type: string
 *               experience:
 *                 type: string
 *               education:
 *                 type: string
 *               employmentType:
 *                 type: string
 *               deadline:
 *                 type: string
 *               sector:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               salary:
 *                 type: string
 *           example:
 *             title: "Backend Developer"
 *             company: "Tech Corp"
 *             link: "https://techcorp.com/jobs/backend-developer"
 *             location: "Seoul"
 *             experience: "2 years"
 *             education: "Bachelor's Degree"
 *             employmentType: "Full-time"
 *             deadline: "2024-12-31"
 *             sector: "IT"
 *             skills: ["JavaScript", "Node.js", "MongoDB"]
 *             salary: "5000만원"
 *     responses:
 *       201:
 *         description: 채용 공고 생성 완료
 *       400:
 *         description: 잘못된 요청 또는 중복된 링크
 *       500:
 *         description: 서버 에러
 */
router.post('/', protect, authorize('admin'), createJob);

// routes/jobRoutes.js

/**
 * @swagger
 * /api/jobs/search:
 *   get:
 *     summary: 채용 공고 검색 (키워드, 회사명, 포지션)
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: false
 *         description: 검색 키워드
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *         required: false
 *         description: 회사명으로 검색
 *       - in: query
 *         name: sector
 *         schema:
 *           type: string
 *         required: false
 *         description: 포지션으로 검색
 *     responses:
 *       200:
 *         description: 검색된 채용 공고 목록 반환
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 에러
 */
router.get('/search', searchJobs);

/**
 * @swagger
 * /api/jobs/filter:
 *   get:
 *     summary: 채용 공고 필터링
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: 지역별 필터링
 *       - in: query
 *         name: employmentType
 *         schema:
 *           type: string
 *         description: 고용 형태별 필터링
 *       - in: query
 *         name: sector
 *         schema:
 *           type: string
 *         description: 산업 분야별 필터링
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
 *         description: 기술 스택별 필터링 (쉼표로 구분)
 *     responses:
 *       200:
 *         description: 필터링된 채용 공고 목록 반환
 *       500:
 *         description: 서버 에러
 */
router.get('/filter', filterJobs);

/**
 * @swagger
 * /api/jobs/sort:
 *   get:
 *     summary: 채용 공고 정렬
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, title]
 *           default: createdAt
 *         description: "정렬 기준 (createdAt: 생성일, title: 공고 제목)"
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: "정렬 순서 (asc: 오름차순, desc: 내림차순)"
 *     responses:
 *       200:
 *         description: 정렬된 채용 공고 목록 반환
 *       500:
 *         description: 서버 에러
 */
router.get('/sort', sortJobs);

/**
 * @swagger
 * /api/jobs/aggregate/industry-count:
 *   get:
 *     summary: 산업별 채용 공고 수 집계
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: 산업별 채용 공고 수 반환
 *       500:
 *         description: 서버 에러
 */
router.get('/aggregate/industry-count', aggregateJobs);

/**
 * @swagger
 * /api/jobs/aggregate/average-salary:
 *   get:
 *     summary: 산업별 평균 연봉 집계
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: 산업별 평균 연봉 반환
 *       500:
 *         description: 서버 에러
 */
router.get('/aggregate/average-salary', aggregateAverageSalaryByIndustry);

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: 채용 공고 전체 조회
 *     tags: [Jobs]
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
 *         description: 페이지당 공고 수
 *     responses:
 *       200:
 *         description: 채용 공고 목록 반환
 *       500:
 *         description: 서버 에러
 */
router.get('/', paginationMiddleware, getJobs);

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: 특정 채용 공고 조회
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 조회할 채용 공고의 ID
 *     responses:
 *       200:
 *         description: 채용 공고 상세 정보 및 관련 공고 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *                 relatedJobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *       404:
 *         description: 채용 공고를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.get('/:id', getJobById);

/**
 * @swagger
 * /api/jobs/{id}:
 *   put:
 *     summary: 특정 채용 공고 수정 (관리자 권한 필요)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 수정할 채용 공고의 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               company:
 *                 type: string
 *               link:
 *                 type: string
 *               location:
 *                 type: string
 *               experience:
 *                 type: string
 *               education:
 *                 type: string
 *               employmentType:
 *                 type: string
 *               deadline:
 *                 type: string
 *               sector:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               salary:
 *                 type: string
 *           example:
 *             title: "Senior Backend Developer"
 *             company: "Tech Corp"
 *             link: "https://techcorp.com/jobs/senior-backend-developer"
 *             location: "Seoul"
 *             experience: "5 years"
 *             education: "Master's Degree"
 *             employmentType: "Full-time"
 *             deadline: "2025-01-31"
 *             sector: "IT"
 *             skills: ["JavaScript", "Node.js", "MongoDB", "AWS"]
 *             salary: "7000만원"
 *     responses:
 *       200:
 *         description: 채용 공고 수정 완료
 *       400:
 *         description: 잘못된 요청 또는 중복된 링크
 *       404:
 *         description: 채용 공고를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.put('/:id', protect, authorize('admin'), updateJob);

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: 특정 채용 공고 삭제 (관리자 권한 필요)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 삭제할 채용 공고의 ID
 *     responses:
 *       200:
 *         description: 채용 공고 삭제 완료
 *       404:
 *         description: 채용 공고를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.delete('/:id', protect, authorize('admin'), deleteJob);

module.exports = router;
