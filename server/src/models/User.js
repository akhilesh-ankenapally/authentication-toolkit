const mongoose = require('mongoose');
const { isConnected } = require('../config/db');

// 1. Mongoose Schema definition for MongoDB
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const MongooseUser = mongoose.model('User', userSchema);

// 2. Lightweight in-memory fallback store (when MongoDB is not running locally)
const memoryUsers = [];

class MemoryUser {
  constructor(data) {
    this._id = 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.createdAt = new Date();
  }

  async save() {
    memoryUsers.push(this);
    return this;
  }

  static async findOne(query) {
    if (query.$or) {
      return memoryUsers.find(u => 
        query.$or.some(cond => {
          if (cond.username && u.username.toLowerCase() === cond.username.toLowerCase()) return true;
          if (cond.email && u.email.toLowerCase() === cond.email.toLowerCase()) return true;
          return false;
        })
      ) || null;
    }
    return null;
  }

  static findById(id) {
    const user = memoryUsers.find(u => u._id === id);
    return {
      select: (excludeField) => {
        if (!user) return null;
        const copy = { ...user };
        if (excludeField === '-password') delete copy.password;
        return copy;
      }
    };
  }
}

// 3. Unified User Interface
module.exports = {
  findOne: async (query) => {
    return isConnected() ? await MongooseUser.findOne(query) : await MemoryUser.findOne(query);
  },
  findById: (id) => {
    return isConnected() ? MongooseUser.findById(id) : MemoryUser.findById(id);
  },
  create: (data) => {
    return isConnected() ? new MongooseUser(data) : new MemoryUser(data);
  }
};
