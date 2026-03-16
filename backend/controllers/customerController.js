const Customer = require("../models/Customer");

// GET all customers — only this owner's customers
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(customers || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST — add new customer
const addCustomer = async (req, res) => {
  try {
    const { name, phone, email, address, city } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    const customer = await Customer.create({
      user: req.user._id,
      name,
      phone,
      email:   email   || "",
      address: address || "",
      city:    city    || "",
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT — edit customer
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, user: req.user._id });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const { name, phone, email, address, city } = req.body;

    customer.name    = name    || customer.name;
    customer.phone   = phone   || customer.phone;
    customer.email   = email   !== undefined ? email   : customer.email;
    customer.address = address !== undefined ? address : customer.address;
    customer.city    = city    !== undefined ? city    : customer.city;

    const updated = await customer.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE — delete customer
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, user: req.user._id });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await customer.deleteOne();
    res.status(200).json({ message: "Customer deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single customer by id
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, user: req.user._id });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCustomers, addCustomer, updateCustomer, deleteCustomer, getCustomerById };