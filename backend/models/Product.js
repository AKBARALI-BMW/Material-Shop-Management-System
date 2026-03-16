const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name:     { type: String, required: true },
    category: { type: String, required: true },
    price:    { type: Number, required: true },
    stock:    { type: Number, required: true, default: 0 },
    minStock: { type: Number, default: 10 },
    unit:     { type: String, required: true },
    status:   { type: String, enum: ["In Stock", "Low Stock", "Out Stock"], default: "In Stock" },
  },
  { timestamps: true }
);

// Auto calculate status before save
productSchema.pre("save", function () {
  if (this.stock === 0)       this.status = "Out Stock";
  else if (this.stock <= 10)  this.status = "Low Stock";
  else                        this.status = "In Stock";
});

module.exports = mongoose.model("Product", productSchema);
