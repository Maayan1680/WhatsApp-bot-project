/**
 * Response Formatter - Formats responses for WhatsApp messages
 */
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');

// Extend dayjs with plugins
dayjs.extend(relativeTime);

/**
 * Format a task for display in WhatsApp
 * @param {Object} task - Task object
 * @returns {String} Formatted message
 */
function formatTask(task) {
  if (!task) return 'No task found.';
  
  const dueDate = dayjs(task.dueDate);
  const now = dayjs();
  const isOverdue = dueDate.isBefore(now, 'day');
  const isToday = dueDate.isSame(now, 'day');
  
  let responseMessage = '';
  
  // Add status emoji
  if (task.status === 'Done') {
    responseMessage += '✅ ';
  } else if (isOverdue) {
    responseMessage += '⚠️ ';
  } else {
    responseMessage += '📝 ';
  }
  
  // Add priority emoji using variable
  const priorityEmoji = task.priority === 'High' ? '🔴' : 
                       task.priority === 'Medium' ? '🟡' : 
                       '🟢';
  
  // Add task details
  responseMessage += `${task.description}\n`;
  responseMessage += `  📅 Due: ${dueDate.format('MMM D, YYYY')} (${dueDate.fromNow()})\n`;
  responseMessage += `  ${priorityEmoji}  Priority: ${task.priority}\n`;
  responseMessage += `  📊 Status: ${task.status}\n`;
  if (task.course) {
    responseMessage += `  📚 Course: ${task.course}\n`;
  }
  
  return responseMessage;
}

/**
 * Format a list of tasks for display
 * @param {Array} tasks - Array of task objects
 * @returns {String} Formatted message
 */
function formatTaskList(tasks) {
  if (!tasks || tasks.length === 0) {
    return 'No tasks found.';
  }
  
  let responseMessage = `📋 Recent tasks:\n\n`;
  
  tasks.forEach((task, index) => {
    responseMessage += `${index + 1}. ${formatTask(task)}\n`;
  });
  
  return responseMessage;
}

/**
 * Format help message
 * @returns {String} Formatted help message
 */
function formatHelpMessage() {
  return '🤖 *WhatsApp Task Manager Bot*\n\n' +
    '📋 *Available Commands:*\n\n' +
    '• *help* - Show this help message\n' +
    '• *show tasks* - Show your recent tasks\n' +
    '• *show today* - Show today\'s tasks\n' +
    '• *delete [number]* - Delete a task (use number from task list)\n' +
    '• *done [number]* - Mark task as done (use number from task list)\n\n' +
    '📝 *Create Task Format:*\n' +
    'Task: [description], Due: [date], Priority: [level], Course: [name]\n\n' +
    '📅 *Date Formats:*\n' +
    '• today or today at 5pm\n' +
    '• tomorrow or tomorrow at 3pm\n' +
    '• MM/DD/YYYY (e.g., 04/15/2024)\n\n' +
    '🎯 *Priority Levels:*\n' +
    'Low 🟢 Medium 🟡 High 🔴\n\n' +
    '📊 *Task Status:*\n' +
    'New 📝 In Progress ⚠️ Done ✅\n\n' +
    '📱 *View all your tasks on our web app:*\n' +
    'http://your-frontend-url/tasks';
}

/**
 * Format error message
 * @param {String} message - Error message
 * @returns {String} Formatted error message
 */
function formatErrorMessage(message) {
  return `❌ ${message}\n\n` +
    'Type `help` to see available commands and format.';
}

module.exports = {
  formatTask,
  formatTaskList,
  formatHelpMessage,
  formatErrorMessage
};