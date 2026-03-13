const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");


dotenv.config();
const app = express();

connectDB();

app.use(express.json());

//  corsse origin resoures    Enables CORS middleware to allow cross-origin requests.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
