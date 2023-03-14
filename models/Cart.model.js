const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = mongoose.Schema(
  {
    userId: { type: String },
    productos: [
      {
        product_id: { type: String, required: true },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity can not be less than 1."],
        },
        price: { type: Number, required: true },
        nombre: { type: String, required: true },
        descripcion: { type: String, required: true },
        categoria: { type: String },
        foto: { type: String, required: true },
        stock: { type: Number, required: true },
      },
    ],
    cantidad: { type: Number },
    subTotal: { type: Number, default: 0 },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
