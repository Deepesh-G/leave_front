const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middleware/authMiddleware");
const ctrl = require("../controllers/leaveController");

// =============================
// EMPLOYEE ROUTES
// =============================

// Apply for leave
router.post("/apply", protect, requireRole("employee"), ctrl.applyLeave);

// Get my leave applications
router.get("/my", protect, requireRole("employee"), ctrl.getMyLeaves);

// Get my leave balance
router.get("/balance", protect, requireRole("employee"), ctrl.getBalance);

// Cancel my leave
router.patch("/cancel/:id", protect, requireRole("employee"), ctrl.cancelLeave);

// =============================
// MANAGER ROUTES
// =============================

// Pending team leaves
router.get("/team", protect, requireRole("manager"), ctrl.getTeamLeaves);

// Approve leave
router.patch("/approve/:id", protect, requireRole("manager"), ctrl.approveLeave);

// Reject leave
router.patch("/reject/:id", protect, requireRole("manager"), ctrl.rejectLeave);

// Approved leaves calendar
router.get("/calendar", protect, requireRole("manager"), ctrl.calendar);

// Full team leave history
router.get("/team-history", protect, requireRole("manager"), ctrl.teamHistory);

module.exports = router;
