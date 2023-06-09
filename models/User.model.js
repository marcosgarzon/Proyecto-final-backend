const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    edad: { type: Number, required: true, min: 1, max: 100 },
    telefono: { type: String, required: true },
    foto: { type: String },
    isAdmin: { type: String, default: "N" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
