const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creating User Models
const articleSchema = new Schema(
  {
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
    createdBy: {
      type: String,
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
