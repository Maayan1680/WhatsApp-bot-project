const User = require('../models/User');

// Find or create user by phone number
async function findOrCreateUser(phoneNumber) {
  let user = await User.findOne({ phoneNumber });
  if (!user) {
    user = await User.create({ phoneNumber });
  }
  return user;
}

// Update user name
async function updateUserName(phoneNumber, name) {
  return await User.findOneAndUpdate(
    { phoneNumber },
    { name },
    { new: true }
  );
}

// Update Google Auth credentials
async function updateGoogleAuth(phoneNumber, googleAuthData) {
  return await User.findOneAndUpdate(
    { phoneNumber },
    { googleAuth: googleAuthData },
    { new: true }
  );
}

// Enable calendar sync permission
async function enableCalendarSync(phoneNumber) {
  return await User.findOneAndUpdate(
    { phoneNumber },
    { calendarSyncEnabled: true },
    { new: true }
  );
}

// Disable calendar sync permission (optional)
async function disableCalendarSync(phoneNumber) {
  return await User.findOneAndUpdate(
    { phoneNumber },
    { calendarSyncEnabled: false },
    { new: true }
  );
}

module.exports = {
  findOrCreateUser,
  updateUserName,
  updateGoogleAuth,
  enableCalendarSync,
  disableCalendarSync
};
