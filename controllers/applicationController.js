// controllers/applicationController.js
const Application = require('../models/Application');
const Job = require('../models/Job');
const Joi = require('joi');
const asyncHandler = require('express-async-handler');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../utils/customError');

/**
 * @desc    지원하기
 * @route   POST /api/applications/apply/:jobId
 * @access  Private
 * @param   {Object} req - Express request 객체
 * @param   {Object} res - Express response 객체
 * @param   {Function} next - Express next 미들웨어 함수
 * @returns {Object} - 지원 완료 메시지와 지원 내역 반환
 */
exports.applyJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;

  // 입력 데이터 검증 (resume는 URI 형식으로 받음)
  const schema = Joi.object({
    resume: Joi.string().uri().required(),
    coverLetter: Joi.string().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) return next(new BadRequestError(error.details[0].message));

  try {
    const job = await Job.findById(jobId);
    if (!job) return next(new NotFoundError('채용 공고를 찾을 수 없습니다.'));

    // 중복 지원 방지
    const existingApplication = await Application.findOne({ user: req.user.id, job: jobId });
    if (existingApplication) return next(new BadRequestError('이미 지원한 공고입니다.'));

    // 이력서 URI 경로 저장
    const resumeUri = req.body.resume;

    const application = new Application({
      user: req.user.id,
      job: jobId,
      resume: resumeUri,
      coverLetter: req.body.coverLetter,
    });

    // 지원 정보 저장 
    await application.save();
    res.status(201).json({ message: '지원 완료', application });
  } catch(err) {
    next(err);
  }
});

/**
 * @desc    지원 취소
 * @route   DELETE /api/applications/cancel/:applicationId
 * @access  Private
 * @param   {Object} req - Express request 객체
 * @param   {Object} res - Express response 객체
 * @param   {Function} next - Express next 미들웨어 함수
 * @returns {Object} - 지원 취소 완료 메시지와 업데이트된 지원 내역 반환
 */
exports.cancelApplication = asyncHandler(async (req, res, next) => {
  const { applicationId } = req.params;

  try {
    const application = await Application.findById(applicationId);
    if (!application) return next(new NotFoundError('지원 내역을 찾을 수 없습니다.'));

    if (application.user.toString() !== req.user.id) {
      return next(new ForbiddenError('권한이 없습니다.'));
    }

    // 지원 상태가 '취소됨'이 아니고, 취소가 가능한 상태인지 확인
    const cancellableStatuses = ['대기중', '진행중'];
    if (!cancellableStatuses.includes(application.status)) {
      return next(new BadRequestError(`현재 상태에서는 지원을 취소할 수 없습니다.`));
    }

    application.status = '취소됨';
    await application.save();

    res.json({ message: '지원 취소 완료', application });
  } catch(err) {
    next(err);
  }
});

/**
 * @desc    지원 내역 조회
 * @route   GET /api/applications
 * @access  Private
 * @param   {Object} req - Express request 객체
 * @param   {Object} res - Express response 객체
 * @param   {Function} next - Express next 미들웨어 함수
 * @returns {Array} - 사용자별 지원 내역 목록 반환
 */
exports.getApplications = asyncHandler(async (req, res, next) => {
  try {
    const { status, sortBy } = req.query; // 상태 및 정렬 기준

    const query = { user: req.user.id };
    if (status) {
      query.status = status;
    }

    let sortOption = { createdAt: -1 }; // 기본: 최신 순
    if (sortBy === 'asc') {
      sortOption = { createdAt: 1 };
    } else if (sortBy === 'desc') {
      sortOption = { createdAt: -1 };
    }

    const applications = await Application.find(query)
      .populate({
        path: 'job',
        populate: { path: 'company sector skills' }
      })
      .sort(sortOption);
    
    res.json(applications);
  } catch(err) {
    next(err);
  }
});

/**
 * @desc    관심 등록
 * @route   POST /api/applications/bookmark/:jobId
 * @access  Private
 * @param   {Object} req - Express request 객체
 * @param   {Object} res - Express response 객체
 * @param   {Function} next - Express next 미들웨어 함수
 * @returns {Object} - 관심 등록 완료 메시지와 관심 내역 반환
 */
exports.bookmarkJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId);
    if (!job) return next(new NotFoundError('채용 공고를 찾을 수 없습니다.'));

    // 이미 관심 등록된 경우
    const existingBookmark = await Application.findOne({ user: req.user.id, job: jobId, resume: { $exists: false } });
    if (existingBookmark) return next(new BadRequestError('이미 관심 등록된 공고입니다.'));

    const application = new Application({
      user: req.user.id,
      job: jobId,
      // resume와 coverLetter는 관심 등록 시 필요 없음
      status: '관심등록',
    });

    await application.save();
    res.status(201).json({ message: '관심 등록 완료', application });
  } catch(err) {
    next(err);
  }
});

/**
 * @desc    관심 취소
 * @route   DELETE /api/applications/bookmark/:jobId
 * @access  Private
 * @param   {Object} req - Express request 객체
 * @param   {Object} res - Express response 객체
 * @param   {Function} next - Express next 미들웨어 함수
 * @returns {Object} - 관심 등록 취소 완료 메시지 반환
 */
exports.unbookmarkJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;

  try {
    const bookmark = await Application.findOne({ user: req.user.id, job: jobId, resume: { $exists: false } });
    if (!bookmark) return next(new NotFoundError('관심 등록된 공고를 찾을 수 없습니다.'));

    await bookmark.remove();
    res.json({ message: '관심 등록 취소 완료' });
  } catch(err) {
    next(err);
  }
});

/**
 * @desc    관심 목록 조회
 * @route   GET /api/applications/bookmarks
 * @access  Private
 * @param   {Object} req - Express request 객체
 * @param   {Object} res - Express response 객체
 * @param   {Function} next - Express next 미들웨어 함수
 * @returns {Array} - 사용자별 관심 등록 목록 반환
 */
exports.getBookmarks = asyncHandler(async (req, res, next) => {
  try {
    const bookmarks = await Application.find({ user: req.user.id, resume: { $exists: false } })
      .populate({
        path: 'job',
        populate: { path: 'company sector skills' }
      });
    res.json(bookmarks);
  } catch(err) {
    next(err);
  }
});
