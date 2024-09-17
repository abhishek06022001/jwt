const express = require("express");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running");
});
const url = process.env.MONGODB_URL;
app.use("/api", require("./Routes/routes"));
mongoose
  .connect(url, {})
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((error) => {
    console.log("Error found here dude", error);
  });
