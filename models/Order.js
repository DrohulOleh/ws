const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  date: { type: Date, default: Date.now },
  list: [
    {
      category: {type: String},
      cost: { type: Number },
      name: { type: String },
      quantity: { type: Number },
      unit: {type: String},
    },
  ],
  order: { type: Number, required: true },
  user: { ref: "users", type: Schema.Types.ObjectId },
});

module.exports = mongoose.model("orders", orderSchema);
