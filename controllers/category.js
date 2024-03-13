const Category = require("../models/Category");
const Product = require("../models/Product");
const errorHandler = require("../helpers/errorHandler");

module.exports.getAll = async function (req, res) {
  try {
    const categories = await Category.find({});

    res.status(200).json(categories);
  } catch (err) {
    errorHandler(res, err);
  }
};

module.exports.getById = async function (req, res) {
  try {
    const category = await Category.findById(req.params.id);

    res.status(200).json(category);
  } catch (err) {
    errorHandler(res, err);
  }
};

module.exports.create = async function (req, res) {
  const candidate = await Category.findOne({ name: req.body.name });

  if (candidate) {
    res
      .status(409)
      .json({ message: `The '${req.body.name}' category already exists` });
  } else {
    const category = new Category({
      name: req.body.name,
      imageSrc: req.file ? req.file.path : "",
    });

    try {
      await category.save();

      res.status(201).json(category);
    } catch (err) {
      errorHandler(res, err);
    }
  }
  /* const category = new Category({
    name: req.body.name,
    imageSrc: req.file ? req.file.path : "",
  }); */

  /* try {
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    errorHandler(res, err);
  } */
};

module.exports.update = async function (req, res) {
  const updated = { name: req.body.name };

  if (req.file) {
    updated.imageSrc = req.file.path;
  }

  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updated },
      { new: true }
    );

    res.status(200).json(category);
  } catch (err) {
    errorHandler(res, err);
  }
};

module.exports.delete = async function (req, res) {
  const category = await Category.findById(req.params.id);

  try {
    await Category.deleteOne({ _id: req.params.id });
    await Product.deleteMany({ category: req.params.id });

    res
      .status(200)
      .json({ message: `Category '${category.name}' has been removed` });
  } catch (err) {
    errorHandler(res, err);
  }
};
