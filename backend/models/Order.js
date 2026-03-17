const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name:     { type: String,  required: true },
  qty:      { type: Number,  required: true },
  price:    { type: Number,  required: true },
  subtotal: { type: Number,  required: true },
});

// ✅ payment history schema
const paymentHistorySchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date:   { type: Date,   default: Date.now },
  note:   { type: String, default: "" },
});

const orderSchema = new mongoose.Schema(
  {
    user:           { type: mongoose.Schema.Types.ObjectId, ref: "User",     required: true },
    customer:       { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    orderNumber:    { type: String, unique: true },
    items:          [orderItemSchema],
    totalAmount:    { type: Number, required: true, default: 0 },
    paidAmount:     { type: Number, required: true, default: 0 },
    dueAmount:      { type: Number, required: true, default: 0 },
    dueDate:        { type: Date,   default: null },
    status:         { type: String, enum: ["Paid", "Partial", "Pending"], default: "Pending" },
    notes:          { type: String, default: "" },
    // ✅ tracks every payment made
    paymentHistory: [paymentHistorySchema],
  },
  { timestamps: true }
);

// Auto generate order number and calculate status
orderSchema.pre("save", async function () {
  if (this.isNew) {
    const count      = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ORD-${String(count + 1).padStart(4, "0")}`;
  }

  // auto calculate due and status
  this.dueAmount = this.totalAmount - this.paidAmount;

  if (this.dueAmount <= 0)       this.status = "Paid";
  else if (this.paidAmount > 0)  this.status = "Partial";
  else                           this.status = "Pending";
});

module.exports = mongoose.model("Order", orderSchema);