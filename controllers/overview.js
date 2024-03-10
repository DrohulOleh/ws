const moment = require("moment");
const Order = require("../models/Order");
const errorHandler = require("../middleware/errorHandler");

module.exports.overview = async function (req, res) {
  try {
    res.status(201).json({ message: "Hello from OVERVIEW controller" });
  } catch (err) {
    errorHandler(res, err);
  }
};
