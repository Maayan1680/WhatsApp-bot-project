/**
 * Twilio Client Utility - MOCK VERSION
 * This version doesn't require Twilio authentication
 * It logs messages instead of sending them
 */

// Mock Twilio client that doesn't require authentication
const createMockTwilioClient = () => {
  console.log('⚠️ Using MOCK Twilio client - messages will be logged but not sent');
  
  return {
    messages: {
      create: async (options) => {
        const mockSid = 'MOCK_' + Math.random().toString(36).substring(2, 15);
        console.log('📱 MOCK WhatsApp message:', {
          from: options.from,
          to: options.to,
          body: options.body,
          mockSid
        });
        
        return { sid: mockSid };
      }
    }
  };
};

// Use mock client instead of actual Twilio client
const client = createMockTwilioClient();

/**
 * Send a WhatsApp message (MOCK VERSION)
 * @param {String} to - Recipient phone number (will be prefixed with 'whatsapp:')
 * @param {String} body - Message content
 * @returns {Promise} Mock Message SID
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
    
    // Send the message using mock client
    const message = await client.messages.create({
      from: `whatsapp:MOCK_TWILIO_NUMBER`,
      body: body,
      to: `whatsapp:${normalizedNumber}`
    });
    
    console.log(`MOCK WhatsApp message sent to ${normalizedNumber}, SID: ${message.sid}`);
    return message.sid;
  } catch (error) {
    console.error('Error sending mock WhatsApp message:', error);
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