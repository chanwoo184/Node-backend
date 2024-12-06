// controllers/userController.js
const User = require('../models/User');
const Joi = require('joi');

// 회원 정보 조회
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    res.json(user);
  } catch(err) {
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
};

// 회원 정보 수정
exports.updateUser = async (req, res) => {
  // 입력 데이터 검증
  const schema = Joi.object({
    username: Joi.string(),
    email:    Joi.string().email(),
    password: Joi.string().min(6),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const updateData = { ...req.body };
    if (updateData.password) {
      // 비밀번호는 pre-save 훅에서 해시 처리
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });

    // 필드 업데이트
    for (let key in updateData) {
      user[key] = updateData[key];
    }

    await user.save();

    res.json({ message: '회원 정보 수정 완료' });
  } catch(err) {
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
};

// 회원 탈퇴
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: '회원 탈퇴 완료' });
  } catch(err) {
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
};
