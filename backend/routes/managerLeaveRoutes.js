const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middleware/authMiddleware");
const LeaveBalance = require("../models/LeaveBalance");
const User = require("../models/User");

// Manager updates employee leave balance
router.patch("/edit-balance/:employeeId", protect, requireRole("manager"), async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { casual, sick, earned } = req.body;

    // Check if employee belongs to this manager
    const employee = await User.findOne({ _id: employeeId, managerId: req.user.userId });

    if (!employee) {
      return res.status(403).json({ message: "You do not manage this employee." });
    }

    // Update leave balance
    const balance = await LeaveBalance.findOneAndUpdate(
      { userId: employeeId },
      { $set: { casual, sick, earned } },
      { new: true }
    );

    res.json({ message: "Leave balance updated.", balance });
  } catch (err) {
    console.error("Leave edit error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch employee leave balance
router.get("/balance/:employeeId", protect, requireRole("manager"), async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Check if employee belongs to this manager
    const employee = await User.findOne({ _id: employeeId, managerId: req.user.userId });
    if (!employee) return res.status(403).json({ message: "Not your employee." });

    const balance = await LeaveBalance.findOne({ userId: employeeId });
    res.json(balance);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
