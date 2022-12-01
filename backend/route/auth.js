const express = require("express");
const router = express.Router();

const {
  createUser,
  signIn,
  getAllUsers,
  updateUserProfile,
  deleteUser,
  getUser,
} = require("../controller/authController");
const { isAuthenticated } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.route("/signup").post(upload, createUser);
router.route("/signIn").post(signIn);
router.route("/me").get(isAuthenticated, getUser);
router.route("/users").get(getAllUsers);
router.route("/update").put(isAuthenticated, upload, updateUserProfile);
router.route("/delete").delete(isAuthenticated, deleteUser);

module.exports = router;
