// controllers/bookmarkController.js
const Bookmark = require('../models/Bookmark');
const Job = require('../models/Job');

exports.bookmarkJob = async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user.id;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: '채용 공고를 찾을 수 없습니다.' });
    }

    const bookmark = new Bookmark({ user: userId, job: jobId });
    await bookmark.save();

    res.status(201).json({ message: '관심 등록 완료', bookmark });
  } catch (error) {
    if (error.code === 11000) { // 중복 키 에러
      return res.status(400).json({ message: '이미 관심 등록된 공고입니다.' });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.unbookmarkJob = async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user.id;

  try {
    const bookmark = await Bookmark.findOneAndDelete({ user: userId, job: jobId });
    if (!bookmark) {
      return res.status(404).json({ message: '관심 등록된 공고를 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '관심 등록 취소 완료' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookmarks = async (req, res) => {
  const userId = req.user.id;

  try {
    const bookmarks = await Bookmark.find({ user: userId }).populate('job');
    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
