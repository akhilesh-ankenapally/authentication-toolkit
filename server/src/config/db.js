const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cybersec_auth';
  try {
    console.log(`[DB] Connecting to MongoDB at ${uri.replace(/\/\/.*@/, '//***:***@')}...`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
    isConnected = true;
    console.log('[DB] Successfully connected to MongoDB.');
    return true;
  } catch (err) {
    console.warn(`[DB Warning] MongoDB connection failed (${err.message}).`);
    console.log('[DB Info] Running in Standalone In-Memory Storage mode for zero-setup demonstration.');
    isConnected = false;
    return false;
  }
};

const getDbStatus = () => ({
  connected: isConnected,
  type: isConnected ? 'MongoDB' : 'In-Memory Demo Store'
});

module.exports = { connectDB, getDbStatus, isConnected: () => isConnected };
