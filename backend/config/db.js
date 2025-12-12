const mongoose = require('mongoose');
module.exports = async function connectDB(){
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/leave_expense_db';
  try{
    await mongoose.connect(uri, { });
    console.log('✅ MongoDB connected successfully');
  }catch(err){
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}