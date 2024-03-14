const Order = require("../models/Order");
const errorHandler = require("../helpers/errorHandler");
const roles = require("../helpers/roles");

module.exports.getAll = async function (req, res) {
  try {
    const currentUser = req.user;

    if (currentUser.role !== roles.admin) {
      const orders = await Order.find({ user: req.user.id }).sort({ date: -1 });

      res.status(200).json(orders);
    }

    const orders = await Order.find({}).sort({ date: -1 });

    res.status(200).json(orders);
  } catch (err) {
    errorHandler(res, err);
  }
};

module.exports.getById = async function (req, res) {
  try {
    const order = await Order.findById(req.params.id);

    res.status(200).json(order);
  } catch (err) {
    errorHandler(res, err);
  }
};

module.exports.create = async function (req, res) {
  try {
    const lastOrder = await Order.findOne({}).sort({ date: -1 });
    const maxOrder = lastOrder ? lastOrder.order : 0;

    const order = await new Order({
      list: req.body.list,
      user: req.user.id,
      order: maxOrder + 1,
    }).save();

    res.status(200).json(order);
  } catch (err) {
    errorHandler(res, err);
  }
};
