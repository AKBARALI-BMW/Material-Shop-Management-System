const Order    = require("../models/Order");
const Product  = require("../models/Product");
const Customer = require("../models/Customer");

const dashboardController = async (req, res) => {
  try {
    const userId = req.user._id;

    // Stats 
    const allOrders    = await Order.find({ user: userId });
    const allCustomers = await Customer.find({ user: userId });
    const allProducts  = await Product.find({ user: userId });

    const totalRevenue   = allOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const totalDue       = allOrders.reduce((s, o) => s + (o.dueAmount   || 0), 0);
    const totalOrders    = allOrders.length;
    const totalCustomers = allCustomers.length;

    // ── Order Status 
    const paid    = allOrders.filter(o => o.status === "Paid").length;
    const partial = allOrders.filter(o => o.status === "Partial").length;
    const pending = allOrders.filter(o => o.status === "Pending").length;

    //  Monthly Revenue — last 6 months 
    const monthlyRevenue = [];
    const now            = new Date();

    for (let i = 5; i >= 0; i--) {
      const date       = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd   = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

      const monthOrders = allOrders.filter((o) => {
        const created = new Date(o.createdAt);
        return created >= monthStart && created <= monthEnd;
      });

      const revenue = monthOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);

      monthlyRevenue.push({
        month:   date.toLocaleString("en-US", { month: "short" }),
        revenue,
      });
    }

    // ── Recent Orders — last 5 
    const recentOrders = await Order.find({ user: userId })
      .populate("customer", "name phone")
      .sort({ createdAt: -1 })
      .limit(5);

    // ── Low Stock Products
    const lowStock = await Product.find({
      user:   userId,
      status: { $in: ["Low Stock", "Out Stock"] },
    }).sort({ stock: 1 }).limit(5);

    // ── Top Customers — top 5 by total amount
    const topCustomers = await Customer.find({ user: userId })
      .sort({ totalAmount: -1 })
      .limit(5);

    // ── Send response
    res.status(200).json({
      stats: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalDue,
      },
      orderStatus: { paid, partial, pending },
      monthlyRevenue,
      recentOrders,
      lowStock,
      topCustomers,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { dashboardController };
