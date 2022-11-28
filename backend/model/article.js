const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes, createHash } = require("node:crypto");

// Creating User Models
const articleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  headLine: {
    type: String,
    required: [true, "please headline for your article"],
  },
  subHead: {
    type: String,
    required: [true, "kindly provide a subhead details"],
  },
  content: {
    type: String,
    required: [true, "please provide your article content"],
  },
  image: {
    public_id: {
      type: String,
      require: true,
    },
    url: {
      type: String,
      require: true,
    },
  },
});

module.exports = mongoose.model("Article", articleSchema);
