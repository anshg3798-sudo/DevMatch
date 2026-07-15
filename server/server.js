const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

// Load environment variables
dotenv.config();

connectDB();

// Create Express app
const app = express();
const projectRoutes = require("./routes/projectRoutes");
// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
// Test Route
app.get("/", (req, res) => {
    res.send("DevMatch API is running...");
});

// Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});