const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", require("./routes/auth"));

// Root route (optional)
app.get("/", (req, res) => {
  res.send("API is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
