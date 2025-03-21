const Task = require('../models/Task');
const { findOrCreateUser } = require('./userService');

// Task Builder (using mandatory fields)
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
      googleCalendarEventId: null,
      googleCalendarId: null
    };
  }

  // Setters
  setDescription(description) {
    this._task.description = description;
    return this;
  }

  setDueDate(dueDate) {
    this._task.dueDate = dueDate;
    return this;
  }

  setStatus(status) {
    this._task.status = status;
    return this;
  }

  setPriority(priority) {
    this._task.priority = priority;
    return this;
  }

  setRepeat(repeat) {
    this._task.repeat = repeat;
    return this;
  }

  setGoogleCalendarEventId(eventId) {
    this._task.googleCalendarEventId = eventId;
    return this;
  }

  setGoogleCalendarId(calendarId) {
    this._task.googleCalendarId = calendarId;
    return this;
  }

  // Getters
  getDescription() {
    return this._task.description;
  }

  getDueDate() {
    return this._task.dueDate;
  }

  getStatus() {
    return this._task.status;
  }

  getPriority() {
    return this._task.priority;
  }

  getRepeat() {
    return this._task.repeat;
  }

  getGoogleCalendarEventId() {
    return this._task.googleCalendarEventId;
  }

  getGoogleCalendarId() {
    return this._task.googleCalendarId;
  }

  getUserId() {
    return this._task.userId;
  }

  build() {
    return this._task;
  }
}

// Database operations:

// Delete a task by taskId and phoneNumber
async function deleteTask(phoneNumber, taskId) {
  try {
    const user = await findOrCreateUser(phoneNumber);
    const result = await Task.deleteOne({ _id: taskId, userId: user._id });
    return result.deletedCount > 0;
  } catch (err) {
    console.error('Error deleting task:', err);
    throw err;
  }
}

// Get all tasks for a user (sorted by due date)
async function getTasksForUser(phoneNumber) {
  try {
    const user = await findOrCreateUser(phoneNumber);
    return await Task.find({ userId: user._id }).sort({ dueDate: 1 });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    throw err;
  }
}

// Mark a task as "Done"
async function markTaskAsDone(phoneNumber, taskId) {
  try {
    const user = await findOrCreateUser(phoneNumber);
    return await Task.findOneAndUpdate(
      { _id: taskId, userId: user._id },
      { status: 'Done' },
      { new: true }
    );
  } catch (err) {
    console.error('Error marking task as done:', err);
    throw err;
  }
}

module.exports = {
  TaskBuilder,
  deleteTask,
  getTasksForUser,
  markTaskAsDone
};
