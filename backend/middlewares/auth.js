// Check if user is authenticated or not

const jwt = require("jsonwebtoken");
const user = require("../model/user");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      new ErrorHandler(
        "Unauthorized access, kindly login to use this resources",
        401
      )
    );
  }

  const decoded = jwt.verify(token, process.env.TOKEN);

  req.user = await user.findById(decoded.id);

  next();
});
