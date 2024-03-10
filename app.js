const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const keys = require("./config/keys");

const authRoutes = require("./routes/auth");
const overviewRoutes = require("./routes/overview");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");

const app = express();

mongoose
  .connect(keys.mongoURI)
  .then(() => console.log(`MongoDB \x1b[32;1mconnected\x1b[m`))
  .catch((error) => console.log(error));

app.use(passport.initialize());
require("./middleware/passport")(passport);

app.use(require("morgan")("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require("cors")());

app.use("/api/auth", authRoutes);
app.use("/api/overview", overviewRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);

module.exports = app;
