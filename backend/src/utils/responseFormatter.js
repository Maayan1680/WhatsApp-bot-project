/**
 * Response Formatter - Formats consistent WhatsApp responses
 */
const dayjs = require('dayjs');

/**
 * Format a single task for WhatsApp display
 * @param {Object} task - Task document
 * @param {Boolean} includeId - Whether to include the task ID
 * @returns {String} Formatted task string
 */
function formatTask(task, includeId = true) {
  const formattedDueDate = dayjs(task.dueDate).format('MMM D, YYYY [at] h:mm A');
  const status = task.status === 'Done' ? '✅' : task.status === 'In Progress' ? '⏳' : '🆕';
  const priority = getPriorityIcon(task.priority) + ' ' + task.priority;
  
  let responseMessage = `${status} *${task.description}*\n`;
  responseMessage += `  📅 Due: ${formattedDueDate}\n`;
  responseMessage += `  ${priority}\n`;
  
  if (task.course) {
    responseMessage += `  📚 Course: ${task.course}\n`;
  }
  
  if (task.repeat !== 'none') {
    responseMessage += `  🔄 Repeat: ${task.repeat}\n`;
  }
  
  if (includeId) {
    responseMessage += `  🆔 ID: ${task._id}\n`;
  }
  
  return responseMessage;
}

/**
 * Get icon for priority level
 * @param {String} priority - Priority level
 * @returns {String} Emoji icon
 */
function getPriorityIcon(priority) {
  switch (priority) {
    case 'High':
      return '🔴';
    case 'Medium':
      return '🟡';
    case 'Low':
      return '🟢';
    default:
      return '⚪';
  }
}

/**
 * Format a list of tasks for WhatsApp display
 * @param {Array} tasks - Array of task documents
 * @param {String} title - Title for the list
 * @returns {String} Formatted task list
 */
function formatTaskList(tasks, title = 'Your Tasks') {
  if (!tasks || tasks.length === 0) {
    return "You don't have any tasks yet. Add one by sending a message!";
  }
  
  let responseMessage = `*${title}:*\n\n`;
  
  tasks.forEach((task, index) => {
    responseMessage += formatTask(task, true);
    
    // Add spacing between tasks
    if (index < tasks.length - 1) {
      responseMessage += '\n';
    }
  });
  
  return responseMessage;
}

/**
 * Format the help message
 * @returns {String} Formatted help message
 */
function formatHelpMessage() {
  return `👋 *Welcome to TaskBot!*\n\n`
    + `I'm your WhatsApp Task Manager. Here's how you can use me:\n\n`
    + `*Add a Task:*\n`
    + `Send any message or use format: Task: [description], Due: [date], Priority: [level], Course: [name], Repeat: [frequency]\n\n`
    + `*Example:*\n`
    + `Task: Submit assignment, Due: tomorrow 5pm, Priority: High, Course: Math\n\n`
    + `*Other Commands:*\n`
    + `• *show tasks* - View all your tasks\n`
    + `• *today* or *agenda* - See today's tasks\n`
    + `• *delete [ID]* - Remove a task\n`
    + `• *done [ID]* - Mark a task as completed\n\n`
    + `Need more help? Just type *help* anytime!`;
}

/**
 * Format an error message
 * @param {String} errorMsg - Error message
 * @returns {String} Formatted error message
 */
function formatErrorMessage(errorMsg) {
  return `❌ *Error:* ${errorMsg}`;
}

/**
 * Format a success message
 * @param {String} message - Success message
 * @returns {String} Formatted success message
 */
function formatSuccessMessage(message) {
  return `✅ *Success:* ${message}`;
}

module.exports = {
  formatTask,
  formatTaskList,
  formatHelpMessage,
  formatErrorMessage,
  formatSuccessMessage
};