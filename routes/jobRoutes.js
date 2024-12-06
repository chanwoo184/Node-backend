// routes/jobRoutes.js
const express = require('express');
const { 
  createJob, getJobs, getJobById, updateJob, deleteJob,
  searchJobs, filterJobs, sortJobs, aggregateJobs, aggregateAverageSalaryByIndustry
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');
const paginate = require('../middleware/paginationMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: 채용 공고 관련 API
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
 *             $ref: '#/components/schemas/Job'
 *           example:
 *             title: "테스트 백엔드 개발자"
 *             company: "테스트 회사"
 *             link: "https://www.example.com/job/test-backend-developer"
 *             location: "서울"
 *             experience: "2년 이상"
 *             education: "학사"
 *             employmentType: "정규직"
 *             deadline: "2024-12-31T00:00:00.000Z"
 *             sector: "개발"
 *             skills: ["JavaScript", "Node.js"]
 *             salary: "5000만원"
 *     responses:
 *       201:
 *         description: 채용 공고 생성 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: 잘못된 입력 데이터 또는 이미 존재하는 링크
 *       401:
 *         description: 인증 토큰이 없거나 유효하지 않음
 *       403:
 *         description: 관리자 권한이 없음
 */
router.post('/', protect, authorize('admin'), createJob);

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: 채용 공고 전체 조회 (페이지네이션 적용)
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
 *           default: 10
 *         description: 페이지당 항목 수
 *     responses:
 *       200:
 *         description: 채용 공고 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *       500:
 *         description: 서버 에러
 */
router.get('/', paginate, getJobs);

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: 특정 채용 공고 조회
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 채용 공고 ID
 *     responses:
 *       200:
 *         description: 특정 채용 공고 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
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
 *     summary: 채용 공고 수정 (관리자 권한 필요)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 채용 공고 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *           example:
 *             salary: "6000만원"
 *     responses:
 *       200:
 *         description: 채용 공고 수정 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: 잘못된 입력 데이터 또는 이미 존재하는 링크
 *       401:
 *         description: 인증 토큰이 없거나 유효하지 않음
 *       403:
 *         description: 관리자 권한이 없음
 *       404:
 *         description: 채용 공고를 찾을 수 없음
 */
router.put('/:id', protect, authorize('admin'), updateJob);

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: 채용 공고 삭제 (관리자 권한 필요)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 채용 공고 ID
 *     responses:
 *       200:
 *         description: 채용 공고 삭제 완료
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
 *         description: 관리자 권한이 없음
 *       404:
 *         description: 채용 공고를 찾을 수 없음
 */
router.delete('/:id', protect, authorize('admin'), deleteJob);

/**
 * @swagger
 * /api/jobs/search:
 *   get:
 *     summary: 채용 공고 검색
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: 검색 키워드
 *     responses:
 *       200:
 *         description: 검색된 채용 공고 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 *       400:
 *         description: 검색 키워드가 없음
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
 *         description: 위치
 *       - in: query
 *         name: employmentType
 *         schema:
 *           type: string
 *         description: 고용 형태
 *       - in: query
 *         name: sector
 *         schema:
 *           type: string
 *         description: 직무 분야
 *       - in: query
 *         name: salaryMin
 *         schema:
 *           type: number
 *         description: 최소 연봉
 *       - in: query
 *         name: salaryMax
 *         schema:
 *           type: number
 *         description: 최대 연봉
 *     responses:
 *       200:
 *         description: 필터링된 채용 공고 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
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
 *           enum: [salary, deadline, createdAt]
 *         description: 정렬 기준
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: 정렬 순서
 *     responses:
 *       200:
 *         description: 정렬된 채용 공고 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 *       500:
 *         description: 서버 에러
 */
router.get('/sort', sortJobs);

/**
 * @swagger
 * /api/jobs/aggregate/industry:
 *   get:
 *     summary: 산업별 채용 공고 수 집계
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: 산업별 채용 공고 수 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   count:
 *                     type: integer
 *       500:
 *         description: 서버 에러
 */
router.get('/aggregate/industry', aggregateJobs);

/**
 * @swagger
 * /api/jobs/aggregate/average-salary:
 *   get:
 *     summary: 산업별 평균 연봉 집계
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: 산업별 평균 연봉 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   averageSalary:
 *                     type: number
 *                   count:
 *                     type: integer
 *       500:
 *         description: 서버 에러
 */
router.get('/aggregate/average-salary', aggregateAverageSalaryByIndustry);

module.exports = router;
