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

router.route("/signup").post(createUser);
router.route("/signIn").post(signIn);
router.route("/me").get(isAuthenticated, getUser);
router.route("/users").get(getAllUsers);
router.route("/update").put(isAuthenticated, updateUserProfile);
router.route("/delete").delete(isAuthenticated, deleteUser);

module.exports = router;
