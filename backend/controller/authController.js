const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../model/user");
const sendTokenToCookie = require("../utils/cookies");
const ErrorHandler = require("../utils/errorHandler");

// Register User
exports.createUser = catchAsyncErrors(async (req, res, next) => {
  const { fname, lname, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorHandler(`${profile.email} already exist.`, 400));
  }

  const newUser = await user.create({
    fname,
    lname,
    email,
    password,
    // avatar: {
    //   public_id: result.public_id,
    //   url: result.secure_url,
    // },
  });

  sendTokenToCookie(newUser, 200, res);
});

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
    { $set: req.body },
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
