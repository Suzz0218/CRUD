const express = require("express");
const cookieParser = require("cookie-parser");
const fileUploader = require("express-fileupload");
const errorMiddleware = require("./middlewares/errors");
const authRoute = require("./route/auth");
const articleRoute = require("./route/article");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", "./backend/views");

app.use(express.json());
app.use(cookieParser());
app.use(fileUploader());

app.use(express.static(path.join(__dirname, "./public")));
app.use("/api/v1/", authRoute);
app.use("/api/v1/", articleRoute);

app.use(errorMiddleware);

module.exports = app;
