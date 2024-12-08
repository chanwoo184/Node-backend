// controllers/userController.js
const User = require('../models/User');
const Joi = require('joi');

/**
 * 회원 정보 조회
 * 
 * 사용자가 로그인된 상태에서 자신의 정보를 조회할 수 있도록 합니다.
 * 비밀번호는 제외하고 반환됩니다.
 * 
 * @async
 * @function getUser
 * @param {import('express').Request} req - Express 요청 객체. 인증 미들웨어를 통해 req.user.id가 설정되어 있어야 합니다.
 * @param {import('express').Response} res - Express 응답 객체.
 * @returns {Promise<void>} - 성공 시 사용자 정보를 JSON 형식으로 반환합니다.
 * @throws {Error} - 서버 에러 발생 시 500 상태 코드와 에러 메시지를 반환합니다.
 */
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    res.json(user);
  } catch(err) {
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
};

/**
 * 회원 정보 수정
 * 
 * 사용자가 자신의 정보를 수정할 수 있도록 합니다.
 * 입력 데이터는 Joi를 사용하여 검증됩니다.
 * 비밀번호가 변경되는 경우, pre-save 훅에서 해시 처리가 수행됩니다.
 * 
 * @async
 * @function updateUser
 * @param {import('express').Request} req - Express 요청 객체. 인증 미들웨어를 통해 req.user.id가 설정되어 있어야 합니다.
 * @param {import('express').Response} res - Express 응답 객체.
 * @returns {Promise<void>} - 성공 시 수정 완료 메시지를 JSON 형식으로 반환합니다.
 * @throws {Error} - 입력 데이터 검증 실패 시 400 상태 코드와 에러 메시지를 반환합니다.
 * @throws {Error} - 사용자 미발견 시 404 상태 코드와 에러 메시지를 반환합니다.
 * @throws {Error} - 서버 에러 발생 시 500 상태 코드와 에러 메시지를 반환합니다.
 */
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

/**
 * 회원 탈퇴
 * 
 * 사용자가 자신의 계정을 삭제할 수 있도록 합니다.
 * 
 * @async
 * @function deleteUser
 * @param {import('express').Request} req - Express 요청 객체. 인증 미들웨어를 통해 req.user.id가 설정되어 있어야 합니다.
 * @param {import('express').Response} res - Express 응답 객체.
 * @returns {Promise<void>} - 성공 시 탈퇴 완료 메시지를 JSON 형식으로 반환합니다.
 * @throws {Error} - 서버 에러 발생 시 500 상태 코드와 에러 메시지를 반환합니다.
 */
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: '회원 탈퇴 완료' });
  } catch(err) {
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
};
