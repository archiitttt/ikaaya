const { StatusCodes } = require("http-status-codes");
const { ExpressError } = require("../Utils/expressError");
const jwt = require("jsonwebtoken");

module.exports.isAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new ExpressError("Unauthorized", StatusCodes.UNAUTHORIZED);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();

  } catch (err) {
    return next(
      new ExpressError("Session expired. Please login again.", StatusCodes.UNAUTHORIZED)
    );
  }
};

module.exports.isAdmin = (req, res, next) => {

  if (!req.user) {
    return next(
      new ExpressError("Unauthorized", StatusCodes.UNAUTHORIZED)
    );
  }

  if (req.user.role !== "admin") {
    return next(
      new ExpressError("Admin access required", StatusCodes.FORBIDDEN)
    );
  }

  next();
};
