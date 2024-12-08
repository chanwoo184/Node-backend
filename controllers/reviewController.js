// controllers/reviewController.js
const Review = require('../models/Review');
const Job = require('../models/Job');

/**
 * Create a new Review for a specific Job
 * 
 * 사용자가 특정 채용 공고에 대한 리뷰를 작성할 수 있도록 합니다.
 * 리뷰는 평점(rating)과 피드백(feedback)을 포함합니다.
 * 
 * @async
 * @function createReview
 * @param {import('express').Request} req - Express 요청 객체. req.params.jobId에 채용 공고 ID가 포함되어 있어야 하며, req.body에 rating과 feedback이 포함되어 있어야 합니다. 인증 미들웨어를 통해 req.user.id가 설정되어 있어야 합니다.
 * @param {import('express').Response} res - Express 응답 객체.
 * @returns {Promise<void>} - 성공 시 생성된 리뷰 정보를 JSON 형식으로 반환합니다.
 * @throws {Error} - 채용 공고를 찾을 수 없을 경우 404 상태 코드와 에러 메시지를 반환합니다.
 * @throws {Error} - 서버 에러 발생 시 500 상태 코드와 에러 메시지를 반환합니다.
 */
exports.createReview = async (req, res) => {
  const { jobId } = req.params;
  const { rating, feedback } = req.body;
  const userId = req.user.id;

  try {
    // 특정 채용 공고가 존재하는지 확인
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: '채용 공고를 찾을 수 없습니다.' });
    }

    // 새로운 리뷰 생성
    const review = new Review({ user: userId, job: jobId, rating, feedback });
    await review.save();

    res.status(201).json({ message: '리뷰 작성 완료', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all Reviews for a specific Job
 * 
 * 특정 채용 공고에 대한 모든 리뷰를 조회할 수 있도록 합니다.
 * 각 리뷰는 작성자(user) 정보를 포함합니다.
 * 
 * @async
 * @function getReviews
 * @param {import('express').Request} req - Express 요청 객체. req.params.jobId에 채용 공고 ID가 포함되어 있어야 합니다.
 * @param {import('express').Response} res - Express 응답 객체.
 * @returns {Promise<void>} - 성공 시 해당 채용 공고의 모든 리뷰를 JSON 형식으로 반환합니다.
 * @throws {Error} - 서버 에러 발생 시 500 상태 코드와 에러 메시지를 반환합니다.
 */
exports.getReviews = async (req, res) => {
  const { jobId } = req.params;

  try {
    // 특정 채용 공고에 대한 모든 리뷰 조회 및 작성자 정보(populate)
    const reviews = await Review.find({ job: jobId }).populate('user');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
