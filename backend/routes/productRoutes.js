const express = require("express");
const router  = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getProducts,
  addProduct,
  updateProduct,
  updateStock,
  deleteProduct,
} = require("../controllers/productController");

router.get("/",              protect, getProducts);   
router.post("/",             protect, addProduct);   
router.put("/:id",           protect, updateProduct);  // PUT    /api/products/:id
router.patch("/:id/stock",   protect, updateStock);    // PATCH  /api/products/:id/stock
router.delete("/:id",        protect, deleteProduct);  // DELETE /api/products/:id

module.exports = router;