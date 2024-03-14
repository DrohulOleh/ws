const mongoose = require("mongoose");
const role = require("../helpers/roles");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: role.user },
  deliveryAddress: [{ type: String }],
  isRegistrationComplete: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model("users", userSchema);
