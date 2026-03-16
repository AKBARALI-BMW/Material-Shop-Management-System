const Product = require("../models/Product");


// get all product as Inventory 

const getInventory = async (req, res) => {
  try {
    const inventory = await Product.find({ user: req.user._id }).sort({ createdAt: -1 });

    // ✅ add default minStock if missing
    const result = inventory.map((item) => ({
      ...item.toObject(),
      minStock: item.minStock || 10,
    }));

    res.status(200).json(result || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// patch set stock (replace current value )
const setStock = async (req, res) => {
    try{
        const product = await Product.findOne({_id: req.params.id, user: req.user._id});

        if(!product) {
            return res.status(404).json({message: "Product not found"});
        }
        product.stock = Number(req.body.stock);
        const updated = await product.save();
        res.status(200).json(updated);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// patch add the stock (add on to of current )

const addStock = async (req, res) => {
    try {
        const product = await Product.findOne({_id: req.params.id, user: req.user._id});

        if(!product) {
            return res.status(404).json({message: "Product not found"});
        }

        product.stock = product.stock + Number(req.body.stock);
        const updated = await product.save();
        res.status(200).json(updated);
    }  catch (error) {
        res.status(500).json({message: error.message});
    }
};

// get low stock products only 

const getLowStock = async (req, res) => {
    try{
        const product = await Product.find({ user: req.user._id, status: {$in: ["Low Stock", "Out Stock"]},
        }).sort({stock: 1});

        res.status(200).json(products || []);
    }  catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = { getInventory, setStock, addStock, getLowStock };