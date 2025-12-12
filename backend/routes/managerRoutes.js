const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middleware/authMiddleware");
const User = require("../models/User");
const LeaveApplication = require("../models/LeaveApplication");


// =============================
// MANAGER → Get list of employees under them
// =============================
router.get("/team-list", protect, requireRole("manager"), async (req, res) => {
  try {
    const employees = await User.find({ managerId: req.user.userId })
      .select("name email _id");

    res.json(employees);
  } catch (err) {
    console.error("Team list error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// =============================
// MANAGER → Calendar View (Approved Leaves)
// =============================
router.get("/team-calendar", protect, requireRole("manager"), async (req, res) => {
  try {
    // Find all employees under this manager
    const employees = await User.find({ managerId: req.user.userId }).select("_id");

    // Find all APPROVED leaves for these employees
    const leaves = await LeaveApplication.find({
      userId: { $in: employees.map(e => e._id) },
      status: "Approved"
    })
    .populate("userId", "name")  // Show employee names
    .sort({ startDate: 1 });

    res.json(leaves);

  } catch (err) {
    console.error("Team calendar error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// manger information 
router.get("/manager/:id", protect, async (req, res) => {
  try {
    const manager = await User.findById(req.params.id).select("name managerCode");
    if (!manager) return res.status(404).json({ message: "Manager not found" });
    res.json(manager);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
