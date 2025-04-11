/**
 * User Service - Handles business logic for user operations
 */
const User = require('../models/User');

/**
 * Find or create a user by phone number
 * @param {String} phoneNumber - The user's phone number (WhatsApp)
 * @returns {Promise<Object>} User document
 */
async function findOrCreateUser(phoneNumber) {
  try {
    let user = await User.findOne({ phoneNumber });
    
    if (!user) {
      user = await User.create({ phoneNumber });
    } else {
      // Update last active timestamp
      user.lastActive = new Date();
      await user.save();
    }
    
    return user;
  } catch (error) {
    console.error('Error in findOrCreateUser:', error.message);
    throw error;
  }
}

/**
 * Update user name
 * @param {String} phoneNumber - The user's phone number
 * @param {String} name - The user's name
 * @returns {Promise<Object>} Updated user document
 */
async function updateUserName(phoneNumber, name) {
  try {
    return await User.findOneAndUpdate(
      { phoneNumber },
      { 
        name,
        lastActive: new Date()
      },
      { new: true }
    );
  } catch (error) {
    console.error('Error in updateUserName:', error.message);
    throw error;
  }
}

/**
 * Get user by ID
 * @param {String} userId - User's MongoDB ID
 * @returns {Promise<Object>} User document
 */
async function getUserById(userId) {
  try {
    return await User.findById(userId);
  } catch (error) {
    console.error('Error in getUserById:', error.message);
    throw error;
  }
}

/**
 * Get all users
 * @returns {Promise<Array>} Array of user documents
 */
async function getAllUsers() {
  try {
    return await User.find().sort({ lastActive: -1 });
  } catch (error) {
    console.error('Error in getAllUsers:', error.message);
    throw error;
  }
}

module.exports = {
  findOrCreateUser,
  updateUserName,
  getUserById,
  getAllUsers
};