const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getInventory,
  setStock,
  addStock,
  getLowStock,
} = require("../controllers/inventoryController");


router.get("/",          protect, getInventory); 
router.get("/low-stock",     protect, getLowStock);
router.patch("/:id/set",    protect, setStock);
router.patch("/:id/add",    protect, addStock);


module.exports = router;