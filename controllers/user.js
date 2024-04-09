const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const keys = require("../config/keys");
const errorHandler = require("../helpers/errorHandler");

module.exports.login = async function (req, res) {
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    const passwordResult = bcrypt.compareSync(
      req.body.password,
      candidate.password
    );

    if (passwordResult) {
      const token = jwt.sign(
        {
          email: candidate.email,
          userId: candidate._id,
          role: candidate.role,
          isRegistrationComplete: candidate.isRegistrationComplete,
        },
        keys.jwtKEY,
        { expiresIn: 3600 * 24 }
      );

      res.status(200).json({ token: `Bearer ${token}` });
    } else {
      res.status(401).json({ message: "Incorrect password, try again" });
    }
  } else {
    res
      .status(404)
      .json({ message: `User with email '${req.body.email}' was not found` });
  }
};

module.exports.registration = async function (req, res) {
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    res.status(409).json({
      message: `Email '${req.body.email}' has already been registered`,
    });
  } else {
    const salt = bcrypt.genSaltSync(10);
    const password = req.body.password;
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(password, salt),
    });

    try {
      await user.save();
      res.status(201).json(user);
    } catch (err) {
      errorHandler(res, err);
    }
  }
};

module.exports.getAll = async function (req, res) {
  try {
    const users = await User.find({});

    res.status(200).json(users);
  } catch (err) {
    errorHandler(res, err);
  }
};

module.exports.update = async function (req, res) {
  try {
  } catch (err) {
    errorHandler(res, err);
  }
};

module.exports.delete = async function (req, res) {
  try {
  } catch (err) {
    errorHandler(res, err);
  }
};
