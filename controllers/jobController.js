// controllers/jobController.js
const Job = require('../models/Job');
const Company = require('../models/Company');
const Category = require('../models/Category');
const Skill = require('../models/Skill');
const Joi = require('joi');
const parseDate = require('../utils/parseDate');
const asyncHandler = require('express-async-handler');
const { BadRequestError, NotFoundError } = require('../utils/customError');

/**
 * @desc    채용 공고 생성
 * @route   POST /jobs
 * @access  Private/Admin
 */
exports.createJob = asyncHandler(async (req, res, next) => {
  // 입력 데이터 검증
  const schema = Joi.object({
    title:          Joi.string().required(),
    company:        Joi.string().required(), // 회사 이름
    link:           Joi.string().uri().required(),
    location:       Joi.string(),
    experience:     Joi.string(),
    education:      Joi.string(),
    employmentType: Joi.string(),
    deadline:       Joi.string().optional(),
    sector:         Joi.string(), // 카테고리 이름
    skills:         Joi.array().items(Joi.string()), // 기술 이름 배열
    salary:         Joi.string(),
  });

  const { error } = schema.validate(req.body);
  if (error) return next(new BadRequestError(error.details[0].message));

  try {
    // 회사 확인 또는 생성
    let company = await Company.findOne({ name: req.body.company });
    if (!company) {
      company = new Company({ name: req.body.company });
      await company.save();
    }

    // 카테고리 확인 또는 생성
    let category = null;
    if (req.body.sector) {
      category = await Category.findOne({ name: req.body.sector });
      if (!category) {
        category = new Category({ name: req.body.sector });
        await category.save();
      }
    }

    // 기술 확인 또는 생성
    let skills = [];
    if (req.body.skills && req.body.skills.length > 0) {
      for (const skillName of req.body.skills) {
        let skill = await Skill.findOne({ name: skillName });
        if (!skill) {
          skill = new Skill({ name: skillName });
          await skill.save();
        }
        skills.push(skill._id);
      }
    }

    // 마감일 파싱
    let deadlineDate = parseDate(req.body.deadline);

    // 마감일이 '상시채용'인 경우 null 설정
    if (req.body.deadline === '상시채용') {
      deadlineDate = null;
    }

    // 채용 공고 생성
    const job = new Job({
      title: req.body.title,
      company: company._id,
      link: req.body.link,
      location: req.body.location,
      experience: req.body.experience,
      education: req.body.education,
      employmentType: req.body.employmentType,
      deadline: deadlineDate,
      sector: category ? category._id : null,
      skills: skills,
      salary: req.body.salary,
      views: 0, // 조회수 초기화
    });

    await job.save();
    res.status(201).json({ message: '채용 공고 생성 완료', job });
  } catch(err) {
    if (err.code === 11000) { // 중복 키 에러
      next(new BadRequestError('이미 존재하는 링크입니다.'));
    } else {
      next(err);
    }
  }
});

/**
 * @desc    채용 공고 전체 조회
 * @route   GET /jobs
 * @access  Public
 */
exports.getJobs = asyncHandler(async (req, res, next) => {
  const { skip, limit, page } = req.pagination;
  try {
    const jobs = await Job.find()
      .populate('company')
      .populate('sector')
      .populate('skills')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // 최신순 정렬

    const total = await Job.countDocuments();
    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      jobs,
    });
  } catch(err) {
    next(err);
  }
});

/**
 * @desc    특정 채용 공고 조회
 * @route   GET /jobs/:id
 * @access  Public
 */
exports.getJobById = asyncHandler(async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company')
      .populate('sector')
      .populate('skills');
    
    if (!job) return next(new NotFoundError('채용 공고를 찾을 수 없습니다.'));

    // 조회수 증가
    job.views = (job.views || 0) + 1;
    await job.save();

    // 관련 공고 추천
    const relatedJobs = await Job.find({
      _id: { $ne: job._id },
      $or: [
        { skills: { $in: job.skills } },
        { sector: job.sector },
        { location: job.location },
        { company: job.company },
      ]
    })
    .limit(5)
    .populate('company')
    .populate('sector')
    .populate('skills');

    res.json({ job, relatedJobs });
  } catch(err) {
    next(err);
  }
});

/**
 * @desc    채용 공고 수정
 * @route   PUT /jobs/:id
 * @access  Private/Admin
 */
exports.updateJob = asyncHandler(async (req, res, next) => {
  // 입력 데이터 검증
  const schema = Joi.object({
    title:          Joi.string(),
    company:        Joi.string(),
    link:           Joi.string().uri(),
    location:       Joi.string(),
    experience:     Joi.string(),
    education:      Joi.string(),
    employmentType: Joi.string(),
    deadline:       Joi.string().optional(),
    sector:         Joi.string(),
    skills:         Joi.array().items(Joi.string()),
    salary:         Joi.string(),
  });

  const { error } = schema.validate(req.body);
  if (error) return next(new BadRequestError(error.details[0].message));

  try {
    const updateData = {};

    // 필드별 업데이트
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.link) updateData.link = req.body.link;
    if (req.body.location) updateData.location = req.body.location;
    if (req.body.experience) updateData.experience = req.body.experience;
    if (req.body.education) updateData.education = req.body.education;
    if (req.body.employmentType) updateData.employmentType = req.body.employmentType;
    if (req.body.salary) updateData.salary = req.body.salary;

    // 마감일 파싱
    if (req.body.deadline) {
      let deadlineDate = parseDate(req.body.deadline);
      if (req.body.deadline === '상시채용') {
        deadlineDate = null;
      }
      updateData.deadline = deadlineDate;
    }

    // 회사 업데이트
    if (req.body.company) {
      let company = await Company.findOne({ name: req.body.company });
      if (!company) {
        company = new Company({ name: req.body.company });
        await company.save();
      }
      updateData.company = company._id;
    }

    // 카테고리 업데이트
    if (req.body.sector) {
      let category = await Category.findOne({ name: req.body.sector });
      if (!category) {
        category = new Category({ name: req.body.sector });
        await category.save();
      }
      updateData.sector = category._id;
    }

    // 기술 업데이트
    if (req.body.skills && req.body.skills.length > 0) {
      let skills = [];
      for (const skillName of req.body.skills) {
        let skill = await Skill.findOne({ name: skillName });
        if (!skill) {
          skill = new Skill({ name: skillName });
          await skill.save();
        }
        skills.push(skill._id);
      }
      updateData.skills = skills;
    }

    const job = await Job.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate('company')
      .populate('sector')
      .populate('skills');

    if (!job) return next(new NotFoundError('채용 공고를 찾을 수 없습니다.'));

    res.json({ message: '채용 공고 수정 완료', job });
  } catch(err) {
    if (err.code === 11000) { // 중복 키 에러
      next(new BadRequestError('이미 존재하는 링크입니다.'));
    } else {
      next(err);
    }
  }
});

/**
 * @desc    채용 공고 삭제
 * @route   DELETE /jobs/:id
 * @access  Private/Admin
 */
exports.deleteJob = asyncHandler(async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return next(new NotFoundError('채용 공고를 찾을 수 없습니다.'));
    res.json({ message: '채용 공고 삭제 완료' });
  } catch(err) {
    next(err);
  }
});

/**
 * @desc    채용 공고 검색
 * @route   GET /jobs/search
 * @access  Public
 */
exports.searchJobs = asyncHandler(async (req, res, next) => {
  try {
    const { keyword } = req.query;
    if (!keyword) return next(new BadRequestError('검색 키워드가 필요합니다.'));

    const jobs = await Job.find({
      title: { $regex: keyword, $options: 'i' },
      // 공고 내용(description) 필드가 있다면 추가
      // $or: [
      //   { title: { $regex: keyword, $options: 'i' } },
      //   { description: { $regex: keyword, $options: 'i' } }
      // ]
    })
    .populate('company')
    .populate('sector')
    .populate('skills');

    res.json(jobs);
  } catch(err) {
    next(err);
  }
});

/**
 * @desc    채용 공고 필터링
 * @route   GET /jobs/filter
 * @access  Public
 */
exports.filterJobs = asyncHandler(async (req, res, next) => {
  try {
    const { location, employmentType, sector, salaryMin, salaryMax, skills } = req.query;
    let filter = {};

    if (location) filter.location = location;
    if (employmentType) filter.employmentType = employmentType;
    if (sector) {
      const category = await Category.findOne({ name: sector });
      if (category) filter.sector = category._id;
    }
    if (salaryMin || salaryMax) {
      filter.salary = {};
      if (salaryMin) filter.salary.$gte = salaryMin;
      if (salaryMax) filter.salary.$lte = salaryMax;
    }
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      filter.skills = { $in: skillsArray };
    }

    const jobs = await Job.find(filter)
      .populate('company')
      .populate('sector')
      .populate('skills');

    res.json(jobs);
  } catch(err) {
    next(err);
  }
});

/**
 * @desc    채용 공고 정렬
 * @route   GET /jobs/sort
 * @access  Public
 */
exports.sortJobs = asyncHandler(async (req, res, next) => {
  try {
    const { sortBy, order } = req.query;
    let sortCriteria = {};

    if (sortBy) {
      sortCriteria[sortBy] = order === 'desc' ? -1 : 1;
    }

    const jobs = await Job.find()
      .sort(sortCriteria)
      .populate('company')
      .populate('sector')
      .populate('skills');

    res.json(jobs);
  } catch(err) {
    next(err);
  }
});

/**
 * @desc    데이터 집계 - 산업별 채용 공고 수
 * @route   GET /jobs/aggregate/industry-count
 * @access  Public
 */
exports.aggregateJobs = asyncHandler(async (req, res, next) => {
  try {
    const aggregation = await Job.aggregate([
      {
        $lookup: {
          from: 'companies',
          localField: 'company',
          foreignField: '_id',
          as: 'companyDetails'
        }
      },
      { $unwind: '$companyDetails' },
      {
        $group: {
          _id: '$companyDetails.industry',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(aggregation);
  } catch(err) {
    next(err);
  }
});

/**
 * @desc    산업별 평균 연봉 집계
 * @route   GET /jobs/aggregate/average-salary
 * @access  Public
 */
exports.aggregateAverageSalaryByIndustry = asyncHandler(async (req, res, next) => {
  try {
    const aggregation = await Job.aggregate([
      {
        $lookup: {
          from: 'companies', // 컬렉션 이름이 소문자 복수형일 수 있으므로 확인 필요
          localField: 'company',
          foreignField: '_id',
          as: 'companyDetails'
        }
      },
      { $unwind: '$companyDetails' },
      {
        $match: {
          salary: { $regex: /^\d+/, $options: 'g' } // 숫자로 시작하는 salary 필드만
        }
      },
      {
        $project: {
          industry: '$companyDetails.industry',
          salary: {
            $toDouble: {
              $replaceAll: { input: '$salary', find: '만원', replacement: '' }
            }
          }
        }
      },
      {
        $group: {
          _id: '$industry',
          averageSalary: { $avg: '$salary' },
          count: { $sum: 1 }
        }
      },
      { $sort: { averageSalary: -1 } }
    ]);

    res.json(aggregation);
  } catch(err) {
    next(err);
  }
});
