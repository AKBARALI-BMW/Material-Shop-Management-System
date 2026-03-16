const express = require("express");
const router  = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
} = require("../controllers/customerController");

router.get("/",      protect, getCustomers);     // GET    /api/customers
router.post("/",     protect, addCustomer);      // POST   /api/customers
router.get("/:id",   protect, getCustomerById);  // GET    /api/customers/:id
router.put("/:id",   protect, updateCustomer);   // PUT    /api/customers/:id
router.delete("/:id",protect, deleteCustomer);   // DELETE /api/customers/:id

module.exports = router;