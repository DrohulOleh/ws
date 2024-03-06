const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "ROLE_USER" },
  deliveryAddress: [{ type: String }],
  isRegistrationComplete: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model("users", userSchema);
