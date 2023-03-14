const mongoose = require("mongoose");

const compraSchema = mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    cart: { type: mongoose.Types.ObjectId, ref: "Cart" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Compra", compraSchema);
