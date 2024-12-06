// utils/customError.js
class CustomError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true; // 운영 중 발생한 에러인지 식별
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  class BadRequestError extends CustomError {
    constructor(message) {
      super(message || '잘못된 요청입니다.', 400);
    }
  }
  
  class UnauthorizedError extends CustomError {
    constructor(message) {
      super(message || '인증이 필요합니다.', 401);
    }
  }
  
  class ForbiddenError extends CustomError {
    constructor(message) {
      super(message || '권한이 없습니다.', 403);
    }
  }
  
  class NotFoundError extends CustomError {
    constructor(message) {
      super(message || '요청한 리소스를 찾을 수 없습니다.', 404);
    }
  }
  
  module.exports = {
    CustomError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
  };
  