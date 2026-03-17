const Order    = require("../models/Order");
const Product  = require("../models/Product");
const Customer = require("../models/Customer");

//  Date filter helper
const getDateRange = (period) => {
  const now   = new Date();
  const start = new Date();

  if (period === "week") {
    start.setDate(now.getDate() - 7);
  } else if (period === "month") {
    start.setMonth(now.getMonth() - 1);
  } else if (period === "year") {
    start.setFullYear(now.getFullYear() - 1);
  } else {
    // default this month
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  }

  return { start, end: now };
};

// ── GET Sales Report ───────────────────────────────────────────────
const getSalesReport = async (req, res) => {
  try {
    const { period = "month" } = req.query;
    const { start, end }       = getDateRange(period);

    const orders = await Order.find({
      user:      req.user._id,
      createdAt: { $gte: start, $lte: end },
    })
      .populate("customer", "name phone")
      .sort({ createdAt: -1 });

    const safeOrders = orders || [];

    const totalRevenue   = safeOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const totalCollected = safeOrders.reduce((s, o) => s + (o.paidAmount  || 0), 0);
    const totalDue       = safeOrders.reduce((s, o) => s + (o.dueAmount   || 0), 0);

    res.status(200).json({
      period,
      totalRevenue,
      totalCollected,
      totalDue,
      totalOrders: safeOrders.length,
      orders:      safeOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET Product Sales Report ───────────────────────────────────────
const getProductSalesReport = async (req, res) => {
  try {
    const { period = "month" } = req.query;
    const { start, end }       = getDateRange(period);

    const orders = await Order.find({
      user:      req.user._id,
      createdAt: { $gte: start, $lte: end },
    });

    // build product sales map
    const productMap = {};

    for (const order of orders) {
      for (const item of order.items || []) {
        const key = item.name;
        if (!productMap[key]) {
          productMap[key] = {
            name:     item.name,
            qtySold:  0,
            revenue:  0,
            orders:   0,
          };
        }
        productMap[key].qtySold += item.qty      || 0;
        productMap[key].revenue += item.subtotal || 0;
        productMap[key].orders  += 1;
      }
    }

    // sort by revenue
    const productSales = Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue);

    const totalRevenue = productSales.reduce((s, p) => s + p.revenue, 0);
    const totalQtySold = productSales.reduce((s, p) => s + p.qtySold, 0);

    res.status(200).json({
      period,
      totalRevenue,
      totalQtySold,
      totalProducts: productSales.length,
      products:      productSales,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET Customer Purchase Report ───────────────────────────────────
const getCustomerReport = async (req, res) => {
  try {
    const customers = await Customer.find({ user: req.user._id })
      .sort({ totalAmount: -1 });

    res.status(200).json(customers || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET Single Customer Orders ─────────────────────────────────────
const getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user:     req.user._id,
      customer: req.params.customerId,
    }).sort({ createdAt: -1 });

    const customer = await Customer.findById(req.params.customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      customer,
      orders: orders || [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET Low Stock Report ───────────────────────────────────────────
const getLowStockReport = async (req, res) => {
  try {
    const products = await Product.find({
      user:   req.user._id,
      status: { $in: ["Low Stock", "Out Stock"] },
    }).sort({ stock: 1 });

    const outCount = products.filter(p => p.status === "Out Stock").length;
    const lowCount = products.filter(p => p.status === "Low Stock").length;

    res.status(200).json({
      outCount,
      lowCount,
      total:    products.length,
      products: products || [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET Invoice — Sale Slip ────────────────────────────────────────
const getInvoice = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id:  req.params.orderId,
      user: req.user._id,
    }).populate("customer", "name phone address city");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // get shop settings for slip header
    const ShopSettings = require("../models/ShopSettings");
    const settings     = await ShopSettings.findOne({ user: req.user._id });

    res.status(200).json({
      shop:  settings || {},
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET Receipt — Payment Slip ─────────────────────────────────────
const getReceipt = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id:  req.params.orderId,
      user: req.user._id,
    }).populate("customer", "name phone address city");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const paymentIndex = Number(req.params.paymentIndex);
    const payment      = order.paymentHistory?.[paymentIndex];

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // get shop settings for slip header
    const ShopSettings = require("../models/ShopSettings");
    const settings     = await ShopSettings.findOne({ user: req.user._id });

    // calculate balance before and after this payment
    const paymentsBeforeThis = order.paymentHistory
      .slice(0, paymentIndex)
      .reduce((s, p) => s + p.amount, 0);

    const previousBalance = order.totalAmount - paymentsBeforeThis;
    const currentBalance  = previousBalance - payment.amount;

    res.status(200).json({
      shop:            settings || {},
      customer:        order.customer,
      orderNumber:     order.orderNumber,
      payment,
      previousBalance,
      cashReceived:    payment.amount,
      currentBalance,
      date:            payment.date,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSalesReport, getProductSalesReport, getCustomerReport, getCustomerOrders, getLowStockReport, getInvoice, getReceipt, };
