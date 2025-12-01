const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
console.log("JWT_SECRET loaded:", process.env.JWT_SECRET ? "Yes" : "No");
const { errorHandler } = require("./middleware/errorMiddleware");
const mongoose = require("mongoose");
const settingsRoutes = require("./routes/settings.js");

// Connect Database
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/od-requests", require("./routes/odRequests"));
const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/forgot-password", require("./routes/forgotPassword"));

// Serve static files from the uploads directory
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, path) => {
      // Set CORS headers for uploaded files
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// Serve static files from the assets directory
app.use(
  "/assets",
  express.static(path.join(__dirname, "assets"), {
    setHeaders: (res, path) => {
      // Set CORS headers for asset files
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// Test route to verify assets are being served
app.get("/api/admin/test-assets", (req, res) => {
  const assetsPath = path.join(__dirname, "assets");
  fs.readdir(assetsPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read assets directory" });
    }
    res.json({ files, path: assetsPath });
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
