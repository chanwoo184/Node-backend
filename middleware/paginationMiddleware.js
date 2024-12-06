// middleware/paginationMiddleware.js
module.exports = (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  req.pagination = { skip, limit, page };
  next();
};
