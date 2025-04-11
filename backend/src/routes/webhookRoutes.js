/**
 * Webhook Routes - Handles Twilio WhatsApp webhook endpoints
 */
const express = require('express');
const webhookController = require('../controllers/webhookController');
const validateTwilioRequest = require('../middleware/twilioAuth');
const router = express.Router();

// Apply Twilio validation to webhook endpoints
// This middleware validates that requests are actually coming from Twilio
router.use('/whatsapp', validateTwilioRequest);

// POST /webhook/whatsapp - Process incoming WhatsApp messages
router.post('/whatsapp', webhookController.processIncomingMessage);

// GET /webhook/health - Health check endpoint for the webhook
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'WhatsApp webhook',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;