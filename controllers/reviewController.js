// controllers/reviewController.js
const Review = require('../models/Review');
const Job = require('../models/Job');

exports.createReview = async (req, res) => {
  const { jobId } = req.params;
  const { rating, feedback } = req.body;
  const userId = req.user.id;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: '채용 공고를 찾을 수 없습니다.' });
    }

    const review = new Review({ user: userId, job: jobId, rating, feedback });
    await review.save();

    res.status(201).json({ message: '리뷰 작성 완료', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReviews = async (req, res) => {
  const { jobId } = req.params;

  try {
    const reviews = await Review.find({ job: jobId }).populate('user');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
