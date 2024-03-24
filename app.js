const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const keys = require("./config/keys");

const userRoutes = require("./routes/user");
const overviewRoutes = require("./routes/overview");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");

const app = express();



mongoose
  .connect(keys.mongoURI)
  .then(() => console.log(`MongoDB \x1b[32;1mconnected\x1b[m`))
  .catch((error) =>
    console.log(
      `MongoDB \x1b[31;1mconnection error\x1b[m. Error: ${error.message}`
    )
  );

app.use(passport.initialize());
require("./helpers/passport")(passport);

app.use(require("morgan")("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require("cors")());

app.use("/api/user", userRoutes);
app.use("/api/overview", overviewRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);

module.exports = app;
