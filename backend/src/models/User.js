/**
 * User model
 */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: { 
    type: String, 
    unique: true, 
    required: true,
    trim: true
  },
  name: { 
    type: String,
    trim: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save hook to clean phone number format if needed
userSchema.pre('save', function(next) {
  // Ensure phone number is in E.164 format (if not already)
  if (!this.phoneNumber.startsWith('+')) {
    this.phoneNumber = '+' + this.phoneNumber;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);