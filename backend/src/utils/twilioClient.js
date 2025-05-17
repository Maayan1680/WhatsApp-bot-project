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

module.exports = {
  sendWhatsAppMessage
};