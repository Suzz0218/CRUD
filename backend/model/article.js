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
  },
  subHead: {
    type: String,
  },
  content: {
    type: String,
  },
});

module.exports = mongoose.model("Article", articleSchema);
