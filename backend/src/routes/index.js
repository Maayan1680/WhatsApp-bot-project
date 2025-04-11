
/**
 * API Routes Index - Combines all API routes
 */
const express = require('express');
const taskRoutes = require('./taskRoutes');
// Future routes can be imported here

const router = express.Router();

// Mount routes
router.use('/tasks', taskRoutes);
// Add more routes as needed

// Basic route for API root
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'WhatsApp Task Manager API',
    version: '1.0.0'
  });
});

module.exports = router;