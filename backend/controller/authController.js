const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../model/user");
const sendTokenToCookie = require("../utils/cookies");
const ErrorHandler = require("../utils/errorHandler");
const express = require("express");
const upload = require("../middlewares/upload");
const router = express.Router();

// Register User
// router.post('/signup', upload, )

// User Login/SignIn => Public route: /api/v1/signin
exports.signIn = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  sendTokenToCookie(user, 200, res);
});

// Get single Users => Public route: /api/v1/me
exports.getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, msg: user });
});

// Get All Users => Public route: /api/v1/users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const user = await User.find();

  res.status(200).json({ success: true, msg: user });
});

exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: req.body.password,
        image: req.file.filename,
      },
    },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new ErrorHandler("User not found", 403));
  }

  res.status(200).json({ success: true, msg: user });
});

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id);

  res.status(200).json({ success: true, msg: "User deleted successfully..." });
});
