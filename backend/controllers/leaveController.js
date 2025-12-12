const LeaveApplication = require("../models/LeaveApplication");
const LeaveBalance = require("../models/LeaveBalance");
const User = require("../models/User");

/* ============================================================
   APPLY LEAVE
============================================================ */
exports.applyLeave = async (req, res) => {
  try {
    const { startDate, endDate, leaveType, reason } = req.body;

    if (!startDate || !endDate || !leaveType)
      return res.status(400).json({ message: "Missing fields" });

    if (!["Casual", "Sick", "Earned"].includes(leaveType))
      return res.status(400).json({ message: "Invalid leave type" });

    if (new Date(startDate) > new Date(endDate))
      return res.status(400).json({ message: "End date must be after start" });

    // Count leave days
    const days =
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 3600 * 24) +
      1;

    const balance = await LeaveBalance.findOne({ userId: req.user.userId });
    if (!balance)
      return res.status(404).json({ message: "Leave balance not found" });

    // Balance validation
    if (leaveType === "Casual" && balance.casual < days)
      return res
        .status(400)
        .json({ message: "Not enough Casual leave available" });

    if (leaveType === "Sick" && balance.sick < days)
      return res.status(400).json({ message: "Not enough Sick leave available" });

    if (leaveType === "Earned" && balance.earned < days)
      return res
        .status(400)
        .json({ message: "Not enough Earned leave available" });

    // Create leave
    const leave = await LeaveApplication.create({
      userId: req.user.userId,
      startDate,
      endDate,
      leaveType,
      reason,
      days,
    });

    res.json({ message: "Leave applied successfully", leave });
  } catch (err) {
    console.error("Apply error", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   MY LEAVES
============================================================ */
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await LeaveApplication.find({
      userId: req.user.userId,
    }).populate("userId", "name email");

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   CANCEL LEAVE
============================================================ */
exports.cancelLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await LeaveApplication.findOne({
      _id: id,
      userId: req.user.userId,
    });

    if (!leave) return res.status(404).json({ message: "Leave not found" });

    if (leave.status !== "Pending")
      return res
        .status(400)
        .json({ message: "Only pending leaves can be cancelled" });

    leave.status = "Cancelled";
    await leave.save();

    res.json({ message: "Leave cancelled", leave });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   MANAGER TEAM LEAVES (Pending)
============================================================ */
exports.getTeamLeaves = async (req, res) => {
  try {
    const employees = await User.find({ managerId: req.user.userId });
    const ids = employees.map((e) => e._id);

    const leaves = await LeaveApplication.find({
      userId: { $in: ids },
    }).populate("userId", "name email");

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   APPROVE LEAVE
============================================================ */
exports.approveLeave = async (req, res) => {
  try {
    const leave = await LeaveApplication.findById(req.params.id).populate(
      "userId"
    );
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    // ensure manager owns employee
    if (String(leave.userId.managerId) !== String(req.user.userId))
      return res.status(403).json({ message: "Not authorized" });

    leave.status = "Approved";
    leave.managerComments = req.body.managerComments || "";
    await leave.save();

    // Deduct days from balance
    const balance = await LeaveBalance.findOne({ userId: leave.userId._id });

    if (balance) {
      const days = leave.days || 1;
      if (leave.leaveType === "Casual")
        balance.casual = Math.max(0, balance.casual - days);
      if (leave.leaveType === "Sick")
        balance.sick = Math.max(0, balance.sick - days);
      if (leave.leaveType === "Earned")
        balance.earned = Math.max(0, balance.earned - days);
      await balance.save();
    }

    res.json({ message: "Leave approved", leave });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   REJECT LEAVE
============================================================ */
exports.rejectLeave = async (req, res) => {
  try {
    const leave = await LeaveApplication.findById(req.params.id).populate(
      "userId"
    );
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    if (String(leave.userId.managerId) !== String(req.user.userId))
      return res.status(403).json({ message: "Not authorized" });

    leave.status = "Rejected";
    leave.managerComments = req.body.managerComments || "";
    await leave.save();

    res.json({ message: "Leave rejected", leave });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   GET MY BALANCE
============================================================ */
exports.getBalance = async (req, res) => {
  try {
    const balance = await LeaveBalance.findOne({ userId: req.user.userId });
    if (!balance)
      return res.status(404).json({ message: "Leave balance not found" });
    res.json(balance);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   TEAM CALENDAR (approved leaves only)
============================================================ */
exports.calendar = async (req, res) => {
  try {
    const employees = await User.find({ managerId: req.user.userId });
    const ids = employees.map((e) => e._id);

    const leaves = await LeaveApplication.find({
      userId: { $in: ids },
      status: "Approved",
    }).populate("userId", "name");

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   TEAM HISTORY (all leaves)
============================================================ */
exports.teamHistory = async (req, res) => {
  try {
    const employees = await User.find({ managerId: req.user.userId });
    const ids = employees.map((e) => e._id);

    const leaves = await LeaveApplication.find({
      userId: { $in: ids },
    }).populate("userId", "name");

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
