const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const LeaveBalance = require('./models/LeaveBalance');

dotenv.config();

async function seed() {
  try {
    console.log("⏳ Connecting to DB...");
    await connectDB();

    console.log("⏳ Clearing old data...");
    await User.deleteMany({});
    await LeaveBalance.deleteMany({});

    const hashed = await bcrypt.hash("123456", 10);

    console.log("⏳ Creating manager...");
    const manager = await User.create({
      name: "Manager One",
      email: "manager@test.com",
      password: hashed,
      role: "manager",
      managerCode: "MGR-10001" // static for testing
    });

    console.log("⏳ Creating employee...");
    const employee = await User.create({
      name: "Employee One",
      email: "employee@test.com",
      password: hashed,
      role: "employee",
      managerId: manager._id
    });

    console.log("⏳ Creating leave balances...");
    await LeaveBalance.create({ userId: manager._id });
    await LeaveBalance.create({ userId: employee._id });

    console.log("✅ Seeded manager & employee successfully!");
    console.log("➡️ Manager Login: manager@test.com / 123456");
    console.log("➡️ Employee Login: employee@test.com / 123456");
    console.log("➡️ Manager Code: MGR-10001");

    process.exit();
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
}

seed();
