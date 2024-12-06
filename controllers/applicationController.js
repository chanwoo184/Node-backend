// controllers/applicationController.js
const Application = require('../models/Application');
const Job = require('../models/Job');
const Joi = require('joi');

// 지원하기
exports.applyJob = async (req, res) => {
  const { jobId } = req.params;

  // 입력 데이터 검증
  const schema = Joi.object({
    resume:       Joi.string().uri().required(),
    coverLetter: Joi.string().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: '채용 공고를 찾을 수 없습니다.' });

    // 중복 지원 방지
    const existingApplication = await Application.findOne({ user: req.user.id, job: jobId });
    if (existingApplication) return res.status(400).json({ message: '이미 지원한 공고입니다.' });

    const application = new Application({
      user: req.user.id,
      job: jobId,
      resume: req.body.resume,
      coverLetter: req.body.coverLetter,
    });

    await application.save();
    res.status(201).json({ message: '지원 완료', application });
  } catch(err) {
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
};

// 지원 취소
exports.cancelApplication = async (req, res) => {
  const { applicationId } = req.params;

  try {
    const application = await Application.findById(applicationId);
    if (!application) return res.status(404).json({ message: '지원 내역을 찾을 수 없습니다.' });

    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }

    await application.remove();
    res.json({ message: '지원 취소 완료' });
  } catch(err) {
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
};

// 지원 내역 조회
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id })
      .populate({
        path: 'job',
        populate: { path: 'company sector skills' }
      });
    res.json(applications);
  } catch(err) {
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
};

// 관심 등록
exports.bookmarkJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: '채용 공고를 찾을 수 없습니다.' });

    // 이미 관심 등록된 경우
    const existingBookmark = await Application.findOne({ user: req.user.id, job: jobId, resume: { $exists: false } });
    if (existingBookmark) return res.status(400).json({ message: '이미 관심 등록된 공고입니다.' });

    const application = new Application({
      user: req.user.id,
      job: jobId,
      // resume와 coverLetter는 관심 등록 시 필요 없음
    });

    await application.save();
    res.status(201).json({ message: '관심 등록 완료' });
  } catch(err) {
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
};

// 관심 취소
exports.unbookmarkJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    const bookmark = await Application.findOne({ user: req.user.id, job: jobId, resume: { $exists: false } });
    if (!bookmark) return res.status(404).json({ message: '관심 등록된 공고를 찾을 수 없습니다.' });

    await bookmark.remove();
    res.json({ message: '관심 등록 취소 완료' });
  } catch(err) {
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
};

// 관심 목록 조회
exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Application.find({ user: req.user.id, resume: { $exists: false } })
      .populate({
        path: 'job',
        populate: { path: 'company sector skills' }
      });
    res.json(bookmarks);
  } catch(err) {
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
};
