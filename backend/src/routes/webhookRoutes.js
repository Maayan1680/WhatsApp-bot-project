/**
 * Webhook Routes - Handles incoming Twilio messaging webhooks
 */
const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// For development/testing with ngrok, we'll disable signature validation temporarily
// In production, you should enable validation for security
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