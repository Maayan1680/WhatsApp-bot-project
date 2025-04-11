/**
 * Webhook Controller - Handles incoming WhatsApp webhook events
 * MOCK VERSION - Works without Twilio authentication
 */
const { parseTaskMessage, parseCommandMessage } = require('../utils/messageParser');
const responseFormatter = require('../utils/responseFormatter');
const taskService = require('../services/taskService');
const twilioClient = require('../utils/twilioClient');

// Mock TwiML response
class MockMessagingResponse {
  constructor() {
    this.messages = [];
  }
  
  message(text) {
    this.messages.push(text);
    return this;
  }
  
  toString() {
    return JSON.stringify({
      response: 'MockTwiML',
      messages: this.messages
    });
  }
}

/**
 * Process incoming WhatsApp messages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.processIncomingMessage = async (req, res) => {
  try {
    // Log incoming message for debugging
    console.log('Received message:', {
      body: req.body.Body,
      from: req.body.From,
      to: req.body.To,
      messageId: req.body.MessageSid || 'MOCK_MESSAGE_ID'
    });

    // Extract message content and sender information
    const incomingMsg = req.body.Body ? req.body.Body.trim() : '';
    
    // Normalize phone number by removing 'whatsapp:' prefix if present
    const from = req.body.From ? req.body.From.replace('whatsapp:', '') : '';
    
    // Check for valid input
    if (!incomingMsg || !from) {
      console.error('Invalid webhook payload: missing Body or From field');
      return res.status(400).send('Bad Request: Missing required fields');
    }
    
    // Create mock response object
    const twiml = new MockMessagingResponse();
    
    // Parse the message to determine the command type
    const { command, params } = parseCommandMessage(incomingMsg);
    
    // Log the detected command
    console.log(`Detected command: ${command}`, params);
    
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
        await handleDeleteTask(from, params.taskId, twiml);
        break;
      case 'markDone':
        await handleMarkDone(from, params.taskId, twiml);
        break;
      case 'createTask':
        await handleCreateTask(from, incomingMsg, twiml);
        break;
      default:
        // Default to creating a task
        await handleCreateTask(from, incomingMsg, twiml);
    }
    
    // Send response in JSON format
    res.status(200).json({
      success: true,
      response: twiml.messages,
      from: 'MOCK_WHATSAPP_BOT'
    });
    
    // Log the response for debugging
    console.log('Sent response message:', twiml.messages);
    
    // Also mock a WhatsApp message being sent to the user
    const responseText = twiml.messages.join('\n\n');
    if (responseText) {
      await twilioClient.sendWhatsAppMessage(from, responseText);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    // Ensure we always send a response
    res.status(200).json({
      success: false,
      error: 'Something went wrong. Please try again later.',
      from: 'MOCK_WHATSAPP_BOT'
    });
  }
};

/**
 * Handle help command
 * @param {Object} twiml - Mock MessagingResponse object
 */
async function handleHelp(twiml) {
  twiml.message(responseFormatter.formatHelpMessage());
}

/**
 * Handle showing all tasks
 * @param {String} from - User's phone number
 * @param {Object} twiml - Mock MessagingResponse object
 */
async function handleShowTasks(from, twiml) {
  try {
    const tasks = await taskService.getTasksForUser(from);
    twiml.message(responseFormatter.formatTaskList(tasks));
  } catch (error) {
    console.error('Error in handleShowTasks:', error);
    twiml.message(responseFormatter.formatErrorMessage('Could not retrieve your tasks. Please try again later.'));
  }
}

/**
 * Handle showing today's tasks
 * @param {String} from - User's phone number
 * @param {Object} twiml - Mock MessagingResponse object
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
 * @param {String} taskId - Task ID to delete
 * @param {Object} twiml - Mock MessagingResponse object
 */
async function handleDeleteTask(from, taskId, twiml) {
  try {
    if (!taskId) {
      twiml.message(responseFormatter.formatErrorMessage('Please specify which task to delete using "delete [task ID]".'));
      return;
    }
    
    const deleted = await taskService.deleteTask(from, taskId);
    
    if (deleted) {
      twiml.message(responseFormatter.formatSuccessMessage('Task deleted successfully!'));
    } else {
      twiml.message(responseFormatter.formatErrorMessage('Task not found or already deleted.'));
    }
  } catch (error) {
    console.error('Error in handleDeleteTask:', error);
    twiml.message(responseFormatter.formatErrorMessage('Could not delete the task. Please try again later.'));
  }
}

/**
 * Handle marking a task as done
 * @param {String} from - User's phone number
 * @param {String} taskId - Task ID to mark as done
 * @param {Object} twiml - Mock MessagingResponse object
 */
async function handleMarkDone(from, taskId, twiml) {
  try {
    if (!taskId) {
      twiml.message(responseFormatter.formatErrorMessage('Please specify which task to mark as done using "done [task ID]".'));
      return;
    }
    
    const updatedTask = await taskService.markTaskAsDone(from, taskId);
    
    if (updatedTask) {
      twiml.message(responseFormatter.formatSuccessMessage(`Task "${updatedTask.description}" marked as done!`));
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
 * @param {Object} twiml - Mock MessagingResponse object
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