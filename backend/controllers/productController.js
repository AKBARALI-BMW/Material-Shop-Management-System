const Product = require("../models/Product");

// GET all products — only this owner's products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST — add new product
const addProduct = async (req, res) => {
  try {
    const { name, category, price, stock, unit } = req.body;

    if (!name || !category || !price || !unit) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.create({
      user: req.user._id,
      name,
      category,
      price,
      stock: stock || 0,
      unit,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT — edit product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user._id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { name, category, price, stock, unit } = req.body;

    product.name     = name     || product.name;
    product.category = category || product.category;
    product.price    = price    || product.price;
    product.stock    = stock    !== undefined ? stock : product.stock;
    product.unit     = unit     || product.unit;

    const updated = await product.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH — update stock only
const updateStock = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user._id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.stock = req.body.stock;
    const updated = await product.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE — delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user._id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, addProduct, updateProduct, updateStock, deleteProduct };