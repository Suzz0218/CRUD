const express = require("express");
const router = express.Router();
const User = require("../model/user");
const Article = require("../model/article");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const multer = require("multer");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");

router.post("/signup", upload, (req, res) => {
  let user = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    image: req.file.filename,
  });

  user.save((err, user) => {
    if (err) {
      (req.session.notify = { message: err.message, success: false }),
        res.redirect("/signup");
    } else {
      req.session.notify = {
        success: true,
        message: "Welcome to Postol!\nStart creating your articles.",
      };
      req.session.message = {
        user: user,
      };
      res.redirect("/signup");
    }
  });
});

router.put("/profile/:id", (req, res) => {
  let id = req.params.id;
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("./uploads/" + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }
  const { email, fname, lname, password } = req.body;

  User.findByIdAndUpdate(
    id,
    { email, fname, lname, password, image },
    (err, user) => {
      if (err) {
        req.session.message = { message: err.message };
        res.render("profile");
      } else {
        res.render("profile", {
          title: "Postol Forum",
          user: user,
        });
        // req.session.message = { user: user };
      }
    }
  );
});

router.get("/signin", async (req, res) => {
  res.render("signin", { title: "Postol Authenticate" });
});

router.post("/signin", (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return next(
        (req.session.notify = {
          message: "Internal server error",
          success: false,
        })
      );
    }
    console.log(req.body.email, req.body.password);

    if (!user) {
      req.session.notify = {
        message: "User not found.",
        success: false,
      };
      res.redirect("/signin");
    } else {
      user.comparePassword(req.body.password, (err, result) => {
        if (err) {
          return next(
            (req.session.notify = {
              message: err.message,
              success: false,
            })
          );
        }
        if (!result) {
          req.session.notify = {
            message: "Invalid password",
            success: false,
          };
          res.redirect("/signin");
        } else {
          req.session.message = {
            message: user,
          };
          req.session.notify = {
            message: "User logged in successfully",
            success: true,
          };
          res.redirect("/signin");
        }
      });
    }
  });
});

router.get("/", (req, res) => {
  Article.find()
    .populate("user", ["fname", "lname", "image"])
    .exec((err, articles) => {
      if (err) {
        req.session.message = { message: err.message };
        res.redirect("/");
      } else {
        res.render("index", {
          title: "Postol Forum",
          articles: articles,
        });
      }
    });
});

router.get("/article/:id", (req, res) => {
  Article.findById(req.params.id)
    .populate("user", ["fname", "lname", "image"])
    .exec((err, article) => {
      if (err) {
        req.session.message = { message: err.message };
        res.render("article", { title: "Postol Forum" });
      } else {
        res.render("article", {
          title: `${article.headLine} Article`,
          article: article,
        });
      }
    });
});

router.get("/write/:id", (req, res) => {
  User.findById(req.params.id).exec((err, user) => {
    if (err) {
      req.session.notify = { message: err.message };
      res.render("write");
    } else {
      res.render("write", {
        title: `${user.fname} Page`,
        user: user,
      });
      req.session.message = { user: user };
    }
  });
});

router.post("/write/:id", (req, res) => {
  let article = new Article({
    headLine: req.body.headLine,
    subHead: req.body.subHead,
    content: req.body.content,
    user: req.params.id,
  });

  article.save((err, article) => {
    if (err) {
      req.session.notify = { message: err.message };
      res.render("write");
    } else {
      res.render(`myarticle`, {
        title: `${article.headLine} Article`,
        article: article,
      });
    }
  });
});

router.put("/write/:id", (req, res) => {
  const { headLine, subHead, content } = req.body;

  const updateArticle = {
    headLine,
    subHead,
    content,
    user: req.params.id,
  };

  Article.findByIdAndUpdate(req.params.id, updateArticle, (err, article) => {
    if (err) {
      req.session.notify = { message: err.message };
      res.render("write");
    } else {
      res.render("myarticle", {
        title: `${article.headLine} Article`,
        article: article,
      });
    }
  });
});

router.get("/delete/article/:id", (req, res) => {
  Article.findByIdAndRemove(req.params.id, (err, response) => {
    if (err) {
      req.session.notify = { message: err.message };
      res.render("article", { title: "Postol Forum" });
    } else {
      req.session.notify = {
        success: true,
        response: "Article deleted successfully",
      };
    }
  });
});

module.exports = router;
