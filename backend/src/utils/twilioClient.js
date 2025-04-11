/**
 * Twilio Client Utility
 * Provides functions for programmatically sending WhatsApp messages
 */
const twilio = require('twilio');

// Initialize the Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send a WhatsApp message
 * @param {String} to - Recipient phone number (will be prefixed with 'whatsapp:')
 * @param {String} body - Message content
 * @returns {Promise} Message SID if successful
 */
const sendWhatsAppMessage = async (to, body) => {
  try {
    // Normalize phone number (ensure it includes country code)
    let normalizedNumber = to;
    if (!normalizedNumber.startsWith('+')) {
      normalizedNumber = '+' + normalizedNumber;
    }
    
    // Remove 'whatsapp:' prefix if it's already there
    normalizedNumber = normalizedNumber.replace('whatsapp:', '');
    
    // Send the message
    const message = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      body: body,
      to: `whatsapp:${normalizedNumber}`
    });
    
    console.log(`WhatsApp message sent to ${normalizedNumber}, SID: ${message.sid}`);
    return message.sid;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
};

/**
 * Send a notification about upcoming tasks
 * @param {String} to - User's phone number
 * @param {Array} tasks - Array of upcoming tasks
 * @returns {Promise} Message SID if successful
 */
const sendTaskReminder = async (to, tasks) => {
  if (!tasks || tasks.length === 0) {
    return null; // No tasks to remind about
  }
  
  let message = '📅 *Task Reminder*\n\n';
  message += 'You have the following tasks coming up:\n\n';
  
  tasks.forEach((task, index) => {
    const dueDate = new Date(task.dueDate);
    const formattedDate = dueDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    message += `*${index + 1}.* ${task.description}\n`;
    message += `   Due: ${formattedDate}\n`;
    if (task.priority) {
      message += `   Priority: ${task.priority}\n`;
    }
    if (task.course) {
      message += `   Course: ${task.course}\n`;
    }
    message += '\n';
  });
  
  message += 'Reply with *show tasks* to see all your tasks.';
  
  return await sendWhatsAppMessage(to, message);
};

module.exports = {
  sendWhatsAppMessage,
  sendTaskReminder
};