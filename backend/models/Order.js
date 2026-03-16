const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product:  {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
    name:  {type: String, required: true},
    qty:   { type: Number, required: true},
    price: { type: Number, required: true},
    subtotal: {type: Number, required: true},
});

const  orderSchema = new mongoose.Schema(
    {
        user:       {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        customer:    {type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true},
        orderNumber: {type: String, unique: true },
        items:      [orderItemSchema],
        totalAmount: {type: Number, required: true, default: 0},
        paidAmount:  {type: Number, required: true, default: 0},
        dueAmount:     {type: Number, required: true, default: 0},
        dueDate:        {type: Date, default: null},
        status:         {type: String, enum: ["Paid", "partial", "Pending"], default: "Pending"},
        notes:      {type: String, default: ""}, 
    },
    {timestamps: true}
);

// Auto generate order number calculate status before save 
orderSchema.pre("save", async function (){
    // generate order number only on new order
    if (this.isNew) {
        const count   = await mongoose.model("Order").countDocuments();
        this.orderNumber  = `ORD-${String(count + 1).padStart(4, "0")}`;

    }

    // auto calculate due and status
  this.dueAmount = this.totalAmount - this.paidAmount;

  if (this.dueAmount <= 0)           this.status = "Paid";
  else if (this.paidAmount > 0)      this.status = "Partial";
  else                               this.status = "Pending";
});

module.exports = mongoose.model("Order", orderSchema);
