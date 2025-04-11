/**
 * Task Service - Handles business logic for task operations
 */
const Task = require('../models/Task');
const { findOrCreateUser } = require('./userService');

/**
 * Task Builder - Implements the builder pattern for creating tasks
 */
class TaskBuilder {
  constructor(userId, description, dueDate) {
    if (!userId || !description || !dueDate) {
      throw new Error('userId, description, and dueDate are required.');
    }
    this._task = {
      userId,
      description,
      dueDate,
      status: 'New',
      priority: 'Medium',
      repeat: 'none',
      course: null
    };
  }

  setDescription(description) {
    this._task.description = description;
    return this;
  }

  setDueDate(dueDate) {
    this._task.dueDate = dueDate;
    return this;
  }

  setStatus(status) {
    if (['New', 'In Progress', 'Done'].includes(status)) {
      this._task.status = status;
    }
    return this;
  }

  setPriority(priority) {
    if (['Low', 'Medium', 'High'].includes(priority)) {
      this._task.priority = priority;
    }
    return this;
  }

  setRepeat(repeat) {
    if (['none', 'Daily', 'Weekly', 'Monthly', 'Yearly'].includes(repeat)) {
      this._task.repeat = repeat;
    }
    return this;
  }

  setCourse(course) {
    this._task.course = course;
    return this;
  }

  /**
   * Build the task object
   * @returns {Object} Task data object
   */
  build() {
    return { ...this._task };
  }

  /**
   * Create and save the task to the database
   * @returns {Promise<Object>} Saved task document
   */
  async save() {
    try {
      const taskData = this.build();
      const task = new Task(taskData);
      return await task.save();
    } catch (error) {
      console.error('Error saving task:', error.message);
      throw error;
    }
  }
}

/**
 * Create a new task for a user
 * @param {String} phoneNumber - User's phone number
 * @param {Object} taskData - Task data
 * @returns {Promise<Object>} Created task
 */
async function createTask(phoneNumber, taskData) {
  try {
    const user = await findOrCreateUser(phoneNumber);
    
    const taskBuilder = new TaskBuilder(
      user._id,
      taskData.description,
      taskData.dueDate
    );
    
    // Add optional properties if provided
    if (taskData.priority) taskBuilder.setPriority(taskData.priority);
    if (taskData.repeat) taskBuilder.setRepeat(taskData.repeat);
    if (taskData.course) taskBuilder.setCourse(taskData.course);
    if (taskData.status) taskBuilder.setStatus(taskData.status);
    
    return await taskBuilder.save();
  } catch (error) {
    console.error('Error creating task:', error.message);
    throw error;
  }
}

/**
 * Delete a task by ID
 * @param {String} phoneNumber - User's phone number
 * @param {String} taskId - Task ID to delete
 * @returns {Promise<Boolean>} True if deletion was successful
 */
async function deleteTask(phoneNumber, taskId) {
  try {
    const user = await findOrCreateUser(phoneNumber);
    const result = await Task.deleteOne({ _id: taskId, userId: user._id });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting task:', error.message);
    throw error;
  }
}

/**
 * Get all tasks for a user
 * @param {String} phoneNumber - User's phone number
 * @param {Object} options - Filtering and sorting options
 * @returns {Promise<Array>} Array of task documents
 */
async function getTasksForUser(phoneNumber, options = {}) {
  try {
    const user = await findOrCreateUser(phoneNumber);
    
    // Build query
    const query = { userId: user._id };
    
    // Add filters if provided
    if (options.status) query.status = options.status;
    if (options.priority) query.priority = options.priority;
    if (options.course) query.course = options.course;
    
    // Date range filtering
    if (options.startDate || options.endDate) {
      query.dueDate = {};
      if (options.startDate) query.dueDate.$gte = options.startDate;
      if (options.endDate) query.dueDate.$lte = options.endDate;
    }
    
    // Build sort options
    const sortOptions = {};
    if (options.sort) {
      sortOptions[options.sort] = options.order === 'desc' ? -1 : 1;
    } else {
      sortOptions.dueDate = 1; // Default sort by due date ascending
    }
    
    return await Task.find(query).sort(sortOptions);
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    throw error;
  }
}

/**
 * Mark a task as done
 * @param {String} phoneNumber - User's phone number
 * @param {String} taskId - Task ID
 * @returns {Promise<Object>} Updated task
 */
async function markTaskAsDone(phoneNumber, taskId) {
  try {
    const user = await findOrCreateUser(phoneNumber);
    return await Task.findOneAndUpdate(
      { _id: taskId, userId: user._id },
      { status: 'Done' },
      { new: true }
    );
  } catch (error) {
    console.error('Error marking task as done:', error.message);
    throw error;
  }
}

/**
 * Update a task
 * @param {String} phoneNumber - User's phone number
 * @param {String} taskId - Task ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated task
 */
async function updateTask(phoneNumber, taskId, updateData) {
  try {
    const user = await findOrCreateUser(phoneNumber);
    return await Task.findOneAndUpdate(
      { _id: taskId, userId: user._id },
      updateData,
      { new: true, runValidators: true }
    );
  } catch (error) {
    console.error('Error updating task:', error.message);
    throw error;
  }
}

/**
 * Get tasks due today
 * @param {String} phoneNumber - User's phone number
 * @returns {Promise<Array>} Array of tasks due today
 */
async function getTasksDueToday(phoneNumber) {
  try {
    const user = await findOrCreateUser(phoneNumber);
    
    // Create date range for today
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    return await Task.find({
      userId: user._id,
      dueDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $ne: 'Done' }
    }).sort({ priority: -1 }); // Sort by priority (high to low)
  } catch (error) {
    console.error('Error fetching today\'s tasks:', error.message);
    throw error;
  }
}

/**
 * Get a task by ID
 * @param {String} phoneNumber - User's phone number
 * @param {String} taskId - Task ID
 * @returns {Promise<Object>} Task document
 */
async function getTaskById(phoneNumber, taskId) {
  try {
    const user = await findOrCreateUser(phoneNumber);
    return await Task.findOne({ _id: taskId, userId: user._id });
  } catch (error) {
    console.error('Error fetching task by ID:', error.message);
    throw error;
  }
}

module.exports = {
  TaskBuilder,
  createTask,
  deleteTask,
  getTasksForUser,
  getTaskById,
  markTaskAsDone,
  updateTask,
  getTasksDueToday
};