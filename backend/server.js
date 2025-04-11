/**
 * Main server entry point
 */
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

// Check required environment variables
checkEnvironment();

// Connect to MongoDB
connectDB();

// Set port
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
  console.log(`Webhook URL for Twilio: http://localhost:${PORT}/webhook/whatsapp`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // In production, we might want to exit and let the process manager restart
  // process.exit(1);
});

// Function to check required environment variables
function checkEnvironment() {
  const requiredVars = [
    'MONGO_URI'
  ];
  
  const twilioVars = [
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER'
  ];
  
  // Check for essential variables
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
  }
  
  // Check for Twilio variables
  const missingTwilioVars = twilioVars.filter(varName => !process.env[varName]);
  if (missingTwilioVars.length > 0) {
    console.warn('⚠️ Missing Twilio environment variables:', missingTwilioVars.join(', '));
    console.warn('⚠️ WhatsApp integration may not work properly.');
  } else {
    console.log('✅ Twilio environment variables are set.');
  }
  
  // Log current environment
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
}

// Export server for testing
module.exports = server;