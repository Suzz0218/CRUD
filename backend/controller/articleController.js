const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Article = require("../model/article");

exports.createArticle = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;

  const { headLine, subLine, content } = req.body;

  const article = await Article.create({
    headLine,
    subLine,
    content,
    // image: {
    //   public_id: result.public_id,
    //   url: result.secure_url,
    // },
  });

  res.status(200).json({ success: true, msg: article });
});

exports.updateArticle = catchAsyncErrors(async (req, res, next) => {
  const article = await Article.findByIdAndUpdate(
    req.user.id,
    { $set: req.body },
    { new: true }
  );

  res.status(200).json({ success: true, msg: article });
});

exports.getArticles = catchAsyncErrors(async (req, res, next) => {
  const articles = await Article.find().populate("user", [
    "fname",
    "lname",
    "avatar",
  ]);

  res.status(200).json({ success: true, msg: articles });
});

exports.getArticleById = catchAsyncErrors(async (req, res, next) => {
  const article = await Article.findById(req.user.id).populate("user", [
    "fname",
    "lname",
    "avatar",
  ]);

  res.status(200).json({ success: true, msg: article });
});

exports.deleteArticle = catchAsyncErrors(async (req, res, next) => {
  await Article.findByIdAndDelete(req.user.id);

  res.status(200).json({ success: true });
});
