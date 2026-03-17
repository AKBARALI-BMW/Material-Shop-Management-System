const express = require("express");
const router  = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getSalesReport,
  getProductSalesReport,
  getCustomerReport,
  getCustomerOrders,
  getLowStockReport,
  getInvoice,
  getReceipt,
} = require("../controllers/reportController");

// Sales report — ?period=week|month|year
router.get("/sales",                        protect, getSalesReport);

// Product sales — ?period=week|month|year
router.get("/products",                     protect, getProductSalesReport);

// All customers report
router.get("/customers",                    protect, getCustomerReport);

// Single customer orders
router.get("/customers/:customerId/orders", protect, getCustomerOrders);

// Low stock report
router.get("/low-stock",                    protect, getLowStockReport);

// Sale invoice slip
router.get("/invoice/:orderId",             protect, getInvoice);

// Payment receipt slip
router.get("/receipt/:orderId/:paymentIndex", protect, getReceipt);

module.exports = router;
