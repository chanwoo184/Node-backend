// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;
  
  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return res.status(401).json({ message: '인증 토큰이 없습니다.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch(err) {
    res.status(401).json({ message: '인증 실패', error: err.message });
  }
};

// 권한 검사 미들웨어
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }
    next();
  };
};
