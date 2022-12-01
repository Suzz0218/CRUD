const app = require("./backend/app");
const dotenv = require("dotenv");
const dbConnect = require("./backend/config/dbConfig");
dotenv.config({ path: "./backend/config/config.env" });

process.on("uncaughtException", (err) => {
  console.log(err.message),
    console.log(`Shutting down due to uncaught exception`);
  process.exit(1);
});

const PORT = process.env.PORT;
const MODE = process.env.NODE_ENV;

dbConnect();

app.get("/", async (req, res) => {
  res.render("index", { title: "Postol Forum" });
});

app.get("/authenticate", async (req, res) => {
  res.render("auth", { title: "Postol Authenticate" });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${MODE} mode`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Server ERR: ${err.message}`),
    console.log(`Shutting down server due to unhandled error rejections`),
    server.close(() => process.exit(1));
});
