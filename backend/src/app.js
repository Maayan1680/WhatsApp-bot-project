/**
 * Express application setup
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middleware/errorHandler');

// Routes
const routes = require('./routes');
const webhookRoutes = require('./routes/webhookRoutes');

// Initialize express
const app = express();

// Body parsers
// JSON parser for API requests
app.use(express.json());
// URL-encoded parser for form submissions and Twilio webhooks
app.use(express.urlencoded({ extended: true }));

// Security headers (disable for Twilio webhook routes)
app.use((req, res, next) => {
  // Skip Helmet for Twilio webhook routes
  if (req.originalUrl.startsWith('/webhook')) {
    next();
  } else {
    helmet()(req, res, next);
  }
});

// Enable CORS
app.use(cors());

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Mount routes
app.use('/api', routes);
app.use('/webhook', webhookRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    service: 'WhatsApp Task Manager API',
    timestamp: new Date().toISOString()
  });
});

// Error handler middleware
app.use(errorHandler);

module.exports = app;