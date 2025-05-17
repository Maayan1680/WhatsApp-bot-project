/**
 * Webhook Controller - Handles incoming WhatsApp webhook events
 */
const { MessagingResponse } = require('twilio').twiml;
const { parseTaskMessage, parseCommandMessage } = require('../utils/messageParser');
const responseFormatter = require('../utils/responseFormatter');
const taskService = require('../services/taskService');
const twilioClient = require('../utils/twilioClient');

/**
 * Process incoming WhatsApp messages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.processIncomingMessage = async (req, res) => {
  try {
    // Debug logging for all request details
    console.log('Webhook Request Received:', {
      headers: req.headers,
      body: req.body,
      timestamp: new Date().toISOString()
    });
    
    // Extract message content and sender information
    const incomingMsg = req.body.Body ? req.body.Body.trim() : '';
    const from = req.body.From ? req.body.From.replace('whatsapp:', '') : '';
    
    // Check for valid input
    if (!incomingMsg || !from) {
      console.error('Invalid webhook payload:', { incomingMsg, from });
      return res.status(400).send('Bad Request: Missing required fields');
    }
    
    // Create Twilio response object
    const twiml = new MessagingResponse();
    
    try {
      // Parse the message to determine the command type
      const { command, params } = parseCommandMessage(incomingMsg);
      console.log(`Processing command: ${command}`, { params, from });
      
      // Handle different command types
      switch (command) {
        case 'help':
          await handleHelp(twiml);
          break;
        case 'showTasks':
          await handleShowTasks(from, twiml);
          break;
        case 'showToday':
          await handleShowToday(from, twiml);
          break;
        case 'deleteTask':
          await handleDeleteTask(from, params.taskNumber, twiml);
          break;
        case 'markDone':
          await handleMarkDone(from, params.taskNumber, twiml);
          break;
        case 'createTask':
          await handleCreateTask(from, incomingMsg, twiml);
          break;
        default:
          await handleCreateTask(from, incomingMsg, twiml);
      }
      
      // Log the response before sending
      console.log('Sending WhatsApp response:', {
        to: from,
        message: twiml.toString(),
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error processing command:', {
        error: error.message,
        stack: error.stack,
        from,
        incomingMsg
      });
      twiml.message(responseFormatter.formatErrorMessage('An error occurred while processing your request. Please try again.'));
    }
    
    // Send the response
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
    
  } catch (error) {
    console.error('Critical error in webhook processing:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    // Ensure we always send a response to Twilio
    const twiml = new MessagingResponse();
    twiml.message(responseFormatter.formatErrorMessage('Something went wrong. Please try again later.'));
    
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  }
};

/**
 * Handle help command
 * @param {Object} twiml - Twilio MessagingResponse object
 */
async function handleHelp(twiml) {
  twiml.message(responseFormatter.formatHelpMessage());
}

/**
 * Handle showing all tasks
 * @param {String} from - User's phone number
 * @param {Object} twiml - Twilio MessagingResponse object
 */
async function handleShowTasks(from, twiml) {
  try {
    // Get first 5 tasks
    const { tasks } = await taskService.getTasksForUser(from, { limit: 5 });
    
    // Get today's date in YYYY-MM-DD format for the link
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    // Get the base URL from environment or use a default
    const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const taskPageUrl = `${frontendBaseUrl}/tasks/${dateString}`;
    
    // Add the link to the task list message
    let message = responseFormatter.formatTaskList(tasks);
    
    // Always show web app link
    message += `\n📱 View all tasks on our web app:\n${taskPageUrl}`;
    
    twiml.message(message);
  } catch (error) {
    console.error('Error in handleShowTasks:', error);
    twiml.message(responseFormatter.formatErrorMessage('Could not retrieve your tasks. Please try again later.'));
  }
}

/**
 * Handle showing today's tasks
 * @param {String} from - User's phone number
 * @param {Object} twiml - Twilio MessagingResponse object
 */
async function handleShowToday(from, twiml) {
  try {
    const tasks = await taskService.getTasksDueToday(from);
    twiml.message(responseFormatter.formatTaskList(tasks, "Today's Tasks"));
  } catch (error) {
    console.error('Error in handleShowToday:', error);
    twiml.message(responseFormatter.formatErrorMessage('Could not retrieve today\'s tasks. Please try again later.'));
  }
}

/**
 * Handle deleting a task
 * @param {String} from - User's phone number
 * @param {String} taskNumber - Task number from the list
 * @param {Object} twiml - Twilio MessagingResponse object
 */
async function handleDeleteTask(from, taskNumber, twiml) {
  try {
    // Get all tasks for the user
    const { tasks } = await taskService.getTasksForUser(from, { limit: 5 });
    
    // Convert task number to index (1-based to 0-based)
    const index = parseInt(taskNumber) - 1;
    
    // Check if the index is valid
    if (isNaN(index) || index < 0 || index >= tasks.length) {
      twiml.message(responseFormatter.formatErrorMessage('Invalid task number. Please use a number from the task list.'));
      return;
    }
    
    // Get the task ID from the task at the specified index
    const taskId = tasks[index]._id;
    
    // Delete the task
    const deleted = await taskService.deleteTask(from, taskId);
    
    if (deleted) {
      twiml.message('✅ Task deleted successfully.');
    } else {
      twiml.message(responseFormatter.formatErrorMessage('Could not delete the task. Please try again later.'));
    }
  } catch (error) {
    console.error('Error in handleDeleteTask:', error);
    twiml.message(responseFormatter.formatErrorMessage('Could not delete the task. Please try again later.'));
  }
}

/**
 * Handle marking a task as done
 * @param {String} from - User's phone number
 * @param {String} taskNumber - Task number from the list
 * @param {Object} twiml - Twilio MessagingResponse object
 */
async function handleMarkDone(from, taskNumber, twiml) {
  try {
    if (!taskNumber) {
      twiml.message(responseFormatter.formatErrorMessage('Please specify which task to mark as done using "done [task number]".'));
      return;
    }
    
    const updatedTask = await taskService.markTaskAsDone(from, taskNumber);
    
    if (updatedTask) {
      twiml.message(`✅ Task "${updatedTask.description}" marked as done!`);
    } else {
      twiml.message(responseFormatter.formatErrorMessage('Task not found.'));
    }
  } catch (error) {
    console.error('Error in handleMarkDone:', error);
    twiml.message(responseFormatter.formatErrorMessage('Could not update the task. Please try again later.'));
  }
}

/**
 * Handle creating a task
 * @param {String} from - User's phone number
 * @param {String} message - Task description message
 * @param {Object} twiml - Twilio MessagingResponse object
 */
async function handleCreateTask(from, message, twiml) {
  try {
    // Parse the message
    const parseResult = parseTaskMessage(message);
    
    if (!parseResult.isValid) {
      twiml.message(responseFormatter.formatErrorMessage(parseResult.errorMessage || "I couldn't understand your task. Please try again."));
      return;
    }
    
    // Create the task
    const task = await taskService.createTask(from, parseResult.parsedData);
    
    // Send confirmation
    const response = `*Task Added Successfully!*\n\n${responseFormatter.formatTask(task)}`;
    twiml.message(response);
  } catch (error) {
    console.error('Error in handleCreateTask:', error);
    twiml.message(responseFormatter.formatErrorMessage('Could not create the task. Please try again later.'));
  }
}