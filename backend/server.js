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
  console.log(`Webhook URL for testing: http://localhost:${PORT}/webhook/whatsapp`);
  console.log(`⚠️ Running with MOCK Twilio client - no actual WhatsApp messages will be sent`);
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
  
  // Check for essential variables
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
  }
  
  // Log that we're using mock Twilio setup
  console.log('✅ Using MOCK Twilio client (no authentication required)');
  
  // Log current environment
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
}

// Export server for testing
module.exports = server;