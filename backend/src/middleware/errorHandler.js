/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error(err.stack);
    
    // Default error information
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Server Error';
    
    res.status(statusCode).json({
      success: false,
      error: message,
      // Include stack trace only in development
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
  };
  
  module.exports = errorHandler;