const mongoose = require("mongoose");



const customerSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name:        { type: String, required: true },
    phone:       { type: String, required: true },
    email:       { type: String, default: "" },
    address:     { type: String, default: "" },
    city:        { type: String, default: "" },
    totalOrders: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    paidAmount:  { type: Number, default: 0 },
    status:      { type: String, enum: ["Clear", "Partial", "Pending"], default: "Clear" },
  },
  { timestamps: true }
);


// Auto calculate status before save
customerSchema.pre("save", function () {
  const due = this.totalAmount - this.paidAmount;
  if (due <= 0)           this.status = "Clear";
  else if (this.paidAmount > 0) this.status = "Partial";
  else                    this.status = "Pending";
});

module.exports = mongoose.model("Customer", customerSchema);