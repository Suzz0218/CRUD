const express = require("express");
const session = require("express-session");
const errorMiddleware = require("./middlewares/errors");
const authRoute = require("./route/auth");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", "./backend/views");

app.use(express.json());
app.use(
  session({
    secret: "secretkey",
    saveUninitialized: true,
    resave: true,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  req.session.message;
  res.locals.notify = req.session.notify;
  delete req.session.notify;
  next();
});

app.use(express.static(path.join(__dirname, "./public")));
app.use("/", authRoute);

module.exports = app;
