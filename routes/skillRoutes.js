// routes/skillRoutes.js
const express = require('express');
const {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} = require('../controllers/skillController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Skills
 *   description: 스킬 관련 API
 */

/**
 * @swagger
 * /api/skills:
 *   post:
 *     summary: 새로운 스킬 생성
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *           example:
 *             name: "JavaScript"
 *             description: "프론트엔드 및 백엔드 개발에 사용되는 스크립팅 언어"
 *     responses:
 *       201:
 *         description: 스킬 생성 완료
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Skill'
 *       400:
 *         description: 잘못된 요청 또는 중복 스킬
 *       401:
 *         description: 인증 토큰이 없거나 유효하지 않음
 *       500:
 *         description: 서버 에러
 */
router.post('/', protect, authorize('admin'), createSkill);

/**
 * @swagger
 * /api/skills:
 *   get:
 *     summary: 모든 스킬 조회
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: 모든 스킬 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Skill'
 *       500:
 *         description: 서버 에러
 */
router.get('/', getSkills);

/**
 * @swagger
 * /api/skills/{id}:
 *   get:
 *     summary: 특정 스킬 조회
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 스킬 ID
 *     responses:
 *       200:
 *         description: 스킬 반환
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Skill'
 *       404:
 *         description: 스킬을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.get('/:id', getSkillById);

/**
 * @swagger
 * /api/skills/{id}:
 *   put:
 *     summary: 특정 스킬 업데이트
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 업데이트할 스킬 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *           example:
 *             name: "TypeScript"
 *             description: "JavaScript의 정적 타입을 추가한 언어"
 *     responses:
 *       200:
 *         description: 스킬 업데이트 완료
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Skill'
 *       400:
 *         description: 잘못된 요청 또는 중복 스킬
 *       401:
 *         description: 인증 토큰이 없거나 유효하지 않음
 *       404:
 *         description: 스킬을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.put('/:id', protect, authorize('admin'), updateSkill);

/**
 * @swagger
 * /api/skills/{id}:
 *   delete:
 *     summary: 특정 스킬 삭제
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 삭제할 스킬 ID
 *     responses:
 *       200:
 *         description: 스킬 삭제 완료
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
 *         description: 스킬을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.delete('/:id', protect, authorize('admin'), deleteSkill);

module.exports = router;
