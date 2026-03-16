const express = require("express");
const router  = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getOrders, getOrderById, createOrder, updatePayment, deleteOrder, } = require("../controllers/orderController");



router.get("/",          protect, getOrders);      
router.post("/",         protect, createOrder);   
router.get("/:id",       protect, getOrderById);  
router.patch("/:id/pay", protect, updatePayment);  // PATCH  /api/orders/:id/pay
router.delete("/:id",    protect, deleteOrder);    // DELETE /api/orders/:id

module.exports = router;