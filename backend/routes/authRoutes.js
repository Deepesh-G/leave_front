const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const User = require("../models/User");

// =============================
// AUTH ROUTES
// =============================
router.post('/register', register);
router.post('/login', login);

// =============================
// GET USER BY ID (Manager Info for Employee Screen)
// =============================
router.get("/user/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("name email role managerCode");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Fetch user error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
