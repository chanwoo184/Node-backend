// controllers/skillController.js
const Skill = require('../models/Skill');

// Create a new Skill
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

// Get all Skills
exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single Skill by ID
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

// Update a Skill by ID
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

// Delete a Skill by ID
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
