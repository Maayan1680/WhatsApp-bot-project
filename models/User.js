const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, unique: true, required: true },
  name: {type: String, required: true},
  googleAuth: {
    accessToken: String,
    refreshToken: String,
    tokenType: String,
    expiryDate: Date
  },
  calendarSyncEnabled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
