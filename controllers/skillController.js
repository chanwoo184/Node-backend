// controllers/skillController.js
const Skill = require('../models/Skill');
const Joi = require('joi');

/**
 * Create a new Skill
 * 
 * 사용자가 새로운 스킬을 생성할 수 있도록 합니다.
 * 스킬 이름은 고유해야 하며, 설명은 선택적입니다.
 * 
 * @async
 * @function createSkill
 * @param {import('express').Request} req - Express 요청 객체. req.body에 name과 description이 포함되어 있어야 합니다.
 * @param {import('express').Response} res - Express 응답 객체.
 * @returns {Promise<void>} - 성공 시 생성된 스킬 정보를 JSON 형식으로 반환합니다.
 * @throws {Error} - 중복 키 에러 시 400 상태 코드와 에러 메시지를 반환합니다.
 * @throws {Error} - 기타 서버 에러 발생 시 500 상태 코드와 에러 메시지를 반환합니다.
 */
exports.createSkill = async (req, res) => {
  const { name, description } = req.body;

  try {
    const skill = new Skill({ name, description });
    await skill.save();
    res.status(201).json({ message: '스킬 생성 완료', skill });
  } catch (error) {
    if (error.code === 11000) { // 중복 키 에러
      return res.status(400).json({ message: '이미 존재하는 스킬입니다.' });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all Skills
 * 
 * 모든 스킬 목록을 조회할 수 있도록 합니다.
 * 
 * @async
 * @function getSkills
 * @param {import('express').Request} req - Express 요청 객체.
 * @param {import('express').Response} res - Express 응답 객체.
 * @returns {Promise<void>} - 성공 시 모든 스킬 목록을 JSON 형식으로 반환합니다.
 * @throws {Error} - 서버 에러 발생 시 500 상태 코드와 에러 메시지를 반환합니다.
 */
exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get a single Skill by ID
 * 
 * 특정 ID를 가진 스킬의 상세 정보를 조회할 수 있도록 합니다.
 * 
 * @async
 * @function getSkillById
 * @param {import('express').Request} req - Express 요청 객체. req.params.id에 스킬 ID가 포함되어 있어야 합니다.
 * @param {import('express').Response} res - Express 응답 객체.
 * @returns {Promise<void>} - 성공 시 해당 스킬의 상세 정보를 JSON 형식으로 반환합니다.
 * @throws {Error} - 스킬을 찾을 수 없을 경우 404 상태 코드와 에러 메시지를 반환합니다.
 * @throws {Error} - 서버 에러 발생 시 500 상태 코드와 에러 메시지를 반환합니다.
 */
exports.getSkillById = async (req, res) => {
  const { id } = req.params;

  try {
    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ message: '스킬을 찾을 수 없습니다.' });
    }
    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update a Skill by ID
 * 
 * 특정 ID를 가진 스킬의 정보를 수정할 수 있도록 합니다.
 * 스킬 이름은 고유해야 하며, 설명은 선택적입니다.
 * 
 * @async
 * @function updateSkill
 * @param {import('express').Request} req - Express 요청 객체. req.params.id에 스킬 ID가 포함되어 있어야 하며, req.body에 name과 description이 포함될 수 있습니다.
 * @param {import('express').Response} res - Express 응답 객체.
 * @returns {Promise<void>} - 성공 시 수정 완료 메시지와 수정된 스킬 정보를 JSON 형식으로 반환합니다.
 * @throws {Error} - 스킬을 찾을 수 없을 경우 404 상태 코드와 에러 메시지를 반환합니다.
 * @throws {Error} - 중복 키 에러 시 400 상태 코드와 에러 메시지를 반환합니다.
 * @throws {Error} - 서버 에러 발생 시 500 상태 코드와 에러 메시지를 반환합니다.
 */
exports.updateSkill = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const skill = await Skill.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!skill) {
      return res.status(404).json({ message: '스킬을 찾을 수 없습니다.' });
    }
    res.status(200).json({ message: '스킬 업데이트 완료', skill });
  } catch (error) {
    if (error.code === 11000) { // 중복 키 에러
      return res.status(400).json({ message: '이미 존재하는 스킬입니다.' });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a Skill by ID
 * 
 * 특정 ID를 가진 스킬을 삭제할 수 있도록 합니다.
 * 
 * @async
 * @function deleteSkill
 * @param {import('express').Request} req - Express 요청 객체. req.params.id에 스킬 ID가 포함되어 있어야 합니다.
 * @param {import('express').Response} res - Express 응답 객체.
 * @returns {Promise<void>} - 성공 시 삭제 완료 메시지를 JSON 형식으로 반환합니다.
 * @throws {Error} - 스킬을 찾을 수 없을 경우 404 상태 코드와 에러 메시지를 반환합니다.
 * @throws {Error} - 서버 에러 발생 시 500 상태 코드와 에러 메시지를 반환합니다.
 */
exports.deleteSkill = async (req, res) => {
  const { id } = req.params;

  try {
    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) {
      return res.status(404).json({ message: '스킬을 찾을 수 없습니다.' });
    }
    res.status(200).json({ message: '스킬 삭제 완료' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
