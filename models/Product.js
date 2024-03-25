const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  category: { ref: "categories", type: Schema.Types.ObjectId, required: true },
  cost: { type: Number, required: true },
  description: { type: String },
  imageSrc: { type: String, default: "" },
  name: { type: String, required: true },
  unit: { type: String },
});

module.exports = mongoose.model("products", productSchema);
