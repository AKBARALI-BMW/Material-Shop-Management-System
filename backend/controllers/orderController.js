const Order  = require("../models/Order");
const Product = require("../models/Product");
const Customer = require("../models/Customer");


// get all order 

const getOrders = async (req, res) => {
    
    try{
        const orders = await Order.find({user: req.user._id})
        .populate("customer", "name phone")
        .sort({createdAt: -1 });
    
        res.status(200).json(orders || []);

    }  catch (error) {
        res.status(500).json({message: error.message});
    }
};

// get single order 
 
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({_id: req.params.id, user: req.user._id})
        .populate("customer", "name phone email address city ");

        if(!order) {
            return res.status(404).json({message: "Order not found "});
        }

        res.status(200).json(order);

    }  catch (error) {
        res.status(500).json({message: error.message});
    }
};

// POST — create new order + subtract stock
const createOrder = async (req, res) => {
  try {
    const { customerId, items, paidAmount, dueDate, notes } = req.body;

    // validate
    if (!customerId || !items || items.length === 0) {
      return res.status(400).json({ message: "Customer and items are required" });
    }

    // check customer exists
    const customer = await Customer.findOne({ _id: customerId, user: req.user._id });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // build order items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findOne({ _id: item.productId, user: req.user._id });

      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available: ${product.stock}`
        });
      }

      const subtotal = item.qty * item.price;
      totalAmount   += subtotal;

      orderItems.push({
        product:  product._id,
        name:     product.name,
        qty:      item.qty,
        price:    item.price,
        subtotal,
      });

      // ✅ subtract stock from product
      product.stock -= item.qty;
      await product.save();
    }

    
    // create order
 const order = await Order.create({
  user:        req.user._id,
  customer:    customerId,
  items:       orderItems,
  totalAmount,
  paidAmount:  paidAmount || 0,
  dueDate:     dueDate    || null,
  notes:       notes      || "",
  // ✅ save first payment in history if paid on creation
  paymentHistory: paidAmount > 0 ? [{
    amount: paidAmount,
    date:   new Date(),
    note:   "Initial payment",
  }] : [],
});


    // ✅ update customer totals and status
    customer.totalOrders += 1;
    customer.totalAmount += totalAmount;
    customer.paidAmount  += paidAmount || 0;
    await customer.save();

    // populate customer before returning
    const populated = await Order.findById(order._id).populate("customer", "name phone");
    res.status(201).json(populated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// PATCH — add partial payment
const updatePayment = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const { amount, note } = req.body;

    // validate
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Please enter a valid payment amount" });
    }

    const payAmount = Number(amount);

    // check overpayment
    if (order.paidAmount + payAmount > order.totalAmount) {
      return res.status(400).json({
        message: `Payment exceeds remaining due amount of Rs ${order.dueAmount}`
      });
    }

    // ✅ add to paid amount
    order.paidAmount += payAmount;

    // ✅ push to payment history
    order.paymentHistory.push({
      amount: payAmount,
      date:   new Date(),
      note:   note || "",
    });

    const updated = await order.save();

    // ✅ update customer paid amount
    const Customer = require("../models/Customer");
    const customer = await Customer.findById(order.customer);
    if (customer) {
      customer.paidAmount += payAmount;
      await customer.save();
    }

    const populated = await Order
      .findById(updated._id)
      .populate("customer", "name phone");

    res.status(200).json(populated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE — delete order + restore stock
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ restore stock for each item
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.qty;
        await product.save();
      }
    }

    // ✅ update customer totals
    const customer = await Customer.findById(order.customer);
    if (customer) {
      customer.totalOrders -= 1;
      customer.totalAmount -= order.totalAmount;
      customer.paidAmount  -= order.paidAmount;
      await customer.save();
    }

    await order.deleteOne();
    res.status(200).json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOrders, getOrderById, createOrder, updatePayment, deleteOrder };
