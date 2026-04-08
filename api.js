const express = require("express");
const connectDB = require("./backend/config/db");
const dotenv = require("dotenv");
const authRoutes = require("./backend/routes/authRoutes");
const userRoutes = require("./backend/routes/userRoutes");
const cors = require("cors");


const settingsRoutes = require("./backend/routes/settingsRoutes");
const productRoutes = require("./backend/routes/productRoutes");
const customerRoutes = require("./backend/routes/customerRoutes");
const inventoryRoutes = require("./backend/routes/inventoryRoutes");
const orderRoutes = require("./backend/routes/orderRoutes");
const reportRoutes = require("./backend/routes/reportRoutes");
const dashboardRoutes = require("./backend/routes/dashboardRoutes");


dotenv.config();
const app = express();

connectDB();

app.use(express.json());

//  corsse origin resoures    Enables CORS middleware to allow cross-origin requests.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('./backend/uploads'));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.use("/api/settings", settingsRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reports", reportRoutes);

app.use("/api/dashboard", dashboardRoutes);


app.get("/", (req, res) => {
  res.send("Server is running");
});

module.exports = (req, res) => {
  app(req, res);
};

const PORT = process.env.PORT || 4000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}