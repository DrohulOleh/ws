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
    const users = await User.find({}).select("-password");

    res.status(200).json(users);
  } catch (err) {
    errorHandler(res, err);
  }
};

module.exports.getById = async function (req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");

    res.status(200).json(user);
  } catch (err) {
    errorHandler(res, err);
  }
};

module.exports.update = async function (req, res) {
  try {
    const salt = bcrypt.genSaltSync(10);
    let hashedPassword;

    if (req.body.password) {
      const password = req.body.password;
      hashedPassword = bcrypt.hashSync(password, salt);
    }

    const updated = {
      deliveryAddress: req.body.deliveryAddress,
      email: req.body.email,
      isRegistrationComplete: req.body.isRegistrationComplete,
      name: req.body.name,
      password: hashedPassword,
      role: req.body.role,
    };

    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updated },
      { new: true }
    );

    res.status(200).json(user);
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

module.exports.refreshToken = async function (req, res) {
  try {
    const currentToken = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(currentToken, keys.jwtKEY);
    const { email, userId, role, isRegistrationComplete } = decoded;
    const user = await User.findById(userId);

    const newToken = jwt.sign(
      {
        email: user.email,
        userId: user._id,
        role: user.role,
        isRegistrationComplete: user.isRegistrationComplete,
      },
      keys.jwtKEY,
      { expiresIn: 3600 * 24 }
    );

    res.status(200).json({ token: `Bearer ${newToken}` });
  } catch (err) {
    errorHandler(res, err);
  }
};
