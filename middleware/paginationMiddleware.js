// middleware/paginationMiddleware.js
const paginate = (req, res, next) => {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    req.pagination = { skip, limit, page };
    next();
  };
  
  module.exports = paginate;
  