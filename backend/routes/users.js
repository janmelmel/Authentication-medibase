const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Get all users (admin only)
router.get("/", async (req, res) => {
  const isAdmin = req.query.role === "admin";
  if (!isAdmin) return res.status(403).json({ message: "Access denied" });

  try {
    const users = await User.find({ role: { $ne: "admin" } }); // Exclude admin
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error getting user" });
  }
});

// Update user (self-edit only)
router.put("/:id", async (req, res) => {
  const { name, email, password, userIdFromClient } = req.body;

  // Make sure the ID matches
  if (req.params.id !== userIdFromClient) {
    return res.status(403).json({ message: "You can only update your own account" });
  }

  try {
    const update = { name, email };

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      update.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    res.json(updatedUser);
  } catch (err) {
    console.error("❌ Update Error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

// Delete user (admin only, cannot delete admin)
router.delete("/:id", async (req, res) => {
  const isAdmin = req.query.role === "admin";
  if (!isAdmin) return res.status(403).json({ message: "Access denied" });

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(403).json({ message: "Cannot delete admin" });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
