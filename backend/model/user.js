const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes, createHash } = require("node:crypto");

// Creating User Models
const userSchema = new Schema(
  {
    fname: {
      type: String,
      required: [true, "Please enter firstname"],
    },
    lname: {
      type: String,
      required: [true, "Please enter Last name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      select: false,
      minlength: [6, "Your password must be longer than six characters"],
    },
    avatar: {
      public_id: {
        type: String,
        require: true,
      },
      url: {
        type: String,
        require: true,
      },
    },
    role: {
      type: String,
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Encrypting Password before saving user details.

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
userSchema.methods.getJwtToken = function () {
  const payload = { id: this._id };

  return jwt.sign(payload, process.env.TOKEN, {
    expiresIn: process.env.TOKEN_EXPIRES_TIME,
  });
};

userSchema.methods.comparePassword = async function (newPassword) {
  return await bcrypt.compare(newPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  //  Generate token
  const generateToken = randomBytes(256).toString("hex");

  // Hash generatedToken

  this.resetPasswordToken = createHash("sha256")
    .update(generateToken)
    .digest("hex");

  // Set Token expire time

  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return generateToken;
};

module.exports = mongoose.model("User", userSchema);
