const mongoose = require("mongoose");

const LeaveBalanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // One balance record per user
  },

  casual: {
    type: Number,
    default: 10,
    min: 0,
  },

  sick: {
    type: Number,
    default: 10,
    min: 0,
  },

  earned: {
    type: Number,
    default: 10,
    min: 0,
  },
});

module.exports = mongoose.model("LeaveBalance", LeaveBalanceSchema);
