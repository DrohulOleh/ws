const Product = require("../models/Product");
const errorHandler = require("../helpers/errorHandler");

module.exports.getAll = async function (req, res) {
  try {
    const product = await Product.find({});

    res.status(200).json(product);
  } catch (err) {
    errorHandler(res, err);
  }
};

module.exports.getByCategoryId = async function (req, res) {
  try {
    const product = await Product.find({ category: req.params.categoryId });

    res.status(200).json(product);
  } catch (err) {
    errorHandler(res, err);
  }
};

module.exports.create = async function (req, res) {
  try {
    const product = await new Product({
      name: req.body.name,
      cost: req.body.cost,
      unit: req.body.unit,
      description: req.body.description,
      imageSrc: req.file ? req.file.path : "",
      category: req.body.category,
    }).save();

    res.status(201).json(product);
  } catch (err) {
    errorHandler(res, err);
  }
};

module.exports.update = async function (req, res) {
  const updated = { name: req.body.name };

  if (req.file) {
    updated.imageSrc = req.file.path;
  }

  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updated },
      { new: true }
    );

    res.status(200).json(product);
  } catch (err) {
    errorHandler(res, err);
  }
};

module.exports.delete = async function (req, res) {
  const product = await Product.findById(req.params.id);

  try {
    await Product.deleteOne({ _id: req.params.id });

    res
      .status(200)
      .json({ message: `Product '${product.name}' has been removed` });
  } catch (err) {
    errorHandler(res, err);
  }
};
