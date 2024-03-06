const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  cost: { type: Number, required: true },
  unit: { type: String },
  description: { type: String },
  imageSrc: { type: String, default: "" },
  category: { ref: "categories", type: Schema.Types.ObjectId },
});

module.exports = mongoose.model("products", productSchema);
