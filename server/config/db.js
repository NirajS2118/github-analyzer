const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      family: 4, // Forces Node to use IPv4 instead of IPv6
      serverSelectionTimeoutMS: 5000, // Fails after 5 seconds instead of hanging forever
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;