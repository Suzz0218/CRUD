const express = require("express");
const {
  createArticle,
  updateArticle,
  getArticles,
  getArticleById,
  deleteArticle,
} = require("../controller/articleController");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");

router.route("/create").post(isAuthenticated, createArticle);
router.route("/update").put(isAuthenticated, updateArticle);
router.route("/articles").get(getArticles);
router.route("article/:id").get(getArticleById);
router.route("/delete").delete(isAuthenticated, deleteArticle);

module.exports = router;
