// controllers/bookmarkController.js
const Bookmark = require('../models/Bookmark');
const Job = require('../models/Job');
const Joi = require('joi');
const asyncHandler = require('express-async-handler');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../utils/customError');

/**
 * @desc    북마크 토글 (추가/제거)
 * @route   POST /bookmarks/toggle/:jobId
 * @access  Private
 */
exports.toggleBookmark = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.user.id;

  // 입력 데이터 검증 (jobId는 URL 파라미터로 받으므로 별도의 검증이 필요 없을 수 있음)
  const schema = Joi.object({
    // 추가적인 바디 파라미터가 필요한 경우 여기에 정의
  });

  const { error } = schema.validate(req.body);
  if (error) return next(new BadRequestError(error.details[0].message));

  try {
    const job = await Job.findById(jobId);
    if (!job) return next(new NotFoundError('채용 공고를 찾을 수 없습니다.'));

    const existingBookmark = await Bookmark.findOne({ user: userId, job: jobId });

    if (existingBookmark) {
      // 북마크가 이미 존재하면 제거
      await Bookmark.findOneAndDelete({ user: userId, job: jobId });
      return res.status(200).json({ message: '관심 등록 취소 완료' });
    } else {
      // 북마크가 없으면 추가
      const bookmark = new Bookmark({ user: userId, job: jobId });
      await bookmark.save();
      return res.status(201).json({ message: '관심 등록 완료', bookmark });
    }
  } catch (error) {
    if (error.code === 11000) { // 중복 키 에러
      return next(new BadRequestError('이미 관심 등록된 공고입니다.'));
    }
    next(error);
  }
});

/**
 * @desc    북마크 목록 조회
 * @route   GET /bookmarks
 * @access  Private
 */
exports.getBookmarks = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', location, experience, salaryMin, salaryMax, skills, keyword, company, position } = req.query;

  // 입력 데이터 검증
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    sortBy: Joi.string().valid('createdAt', 'jobTitle').optional(),
    sortOrder: Joi.string().valid('asc', 'desc').optional(),
    location: Joi.string().optional(),
    experience: Joi.string().optional(),
    salaryMin: Joi.number().optional(),
    salaryMax: Joi.number().optional(),
    skills: Joi.string().optional(), // comma-separated string
    keyword: Joi.string().optional(),
    company: Joi.string().optional(),
    position: Joi.string().optional(),
  });

  const { error } = schema.validate(req.query);
  if (error) return next(new BadRequestError(error.details[0].message));

  // Build query object
  const query = { user: userId };

  // Filtering
  if (location) {
    query['job.location'] = location;
  }

  if (experience) {
    query['job.experience'] = experience;
  }

  if (salaryMin || salaryMax) {
    query['job.salary'] = {};
    if (salaryMin) query['job.salary'].$gte = salaryMin;
    if (salaryMax) query['job.salary'].$lte = salaryMax;
  }

  if (skills) {
    const skillsArray = skills.split(',').map(skill => skill.trim());
    query['job.skills'] = { $in: skillsArray };
  }

  // Searching
  if (keyword) {
    query['job.title'] = { $regex: keyword, $options: 'i' };
    // 추가적으로 job.description 등 다른 필드도 검색하려면 $or 사용
  }

  if (company) {
    query['job.company'] = { $regex: company, $options: 'i' };
  }

  if (position) {
    query['job.position'] = { $regex: position, $options: 'i' };
  }

  // Pagination
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    populate: {
      path: 'job',
      populate: { path: 'company sector skills' }
    },
    sort: {}
  };

  // Sorting
  if (sortBy === 'jobTitle') {
    options.sort['job.title'] = sortOrder === 'asc' ? 1 : -1;
  } else {
    options.sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  }

  try {
    const bookmarks = await Bookmark.find(query)
      .populate({
        path: 'job',
        populate: { path: 'company sector skills' }
      })
      .sort(options.sort)
      .skip((options.page - 1) * options.limit)
      .limit(options.limit);

    const total = await Bookmark.countDocuments(query);
    const totalPages = Math.ceil(total / options.limit);

    res.status(200).json({
      total,
      totalPages,
      currentPage: options.page,
      bookmarks
    });
  } catch (error) {
    next(error);
  }
});
