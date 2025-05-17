/**
 * Task Controller - Handles API requests for task operations
 * These endpoints will be used by the future React frontend
 */
const taskService = require('../services/taskService');

/**
 * Get all tasks for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getTasks = async (req, res, next) => {
  try {
    // In a real implementation, you would get the user from authentication
    // For now, we'll get it from a query parameter
    const { phoneNumber } = req.query;
    
    if (!phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        error: 'Phone number is required' 
      });
    }
    
    // Build filter options from query parameters
    const options = {
      status: req.query.status,
      priority: req.query.priority,
      course: req.query.course,
      sort: req.query.sort,
      order: req.query.order
    };
    
    // Handle date range filtering
    if (req.query.startDate) {
      options.startDate = new Date(req.query.startDate);
    }
    
    if (req.query.endDate) {
      options.endDate = new Date(req.query.endDate);
    }
    
    const tasks = await taskService.getTasksForUser(phoneNumber, options);
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single task by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getTask = async (req, res, next) => {
  try {
    const { phoneNumber } = req.query;
    const taskId = req.params.id;
    
    if (!phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        error: 'Phone number is required' 
      });
    }
    
    // This would need to be implemented in the task service
    const task = await taskService.getTaskById(phoneNumber, taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createTask = async (req, res, next) => {
  try {
    const { phoneNumber } = req.query;
    
    if (!phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        error: 'Phone number is required' 
      });
    }
    
    const task = await taskService.createTask(phoneNumber, req.body);
    
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateTask = async (req, res, next) => {
  try {
    const { phoneNumber } = req.query;
    const taskId = req.params.id;
    
    if (!phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        error: 'Phone number is required' 
      });
    }
    
    const task = await taskService.updateTask(phoneNumber, taskId, req.body);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.deleteTask = async (req, res, next) => {
  try {
    const { phoneNumber } = req.query;
    const taskId = req.params.id;
    
    if (!phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        error: 'Phone number is required' 
      });
    }
    
    const deleted = await taskService.deleteTask(phoneNumber, taskId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get today's tasks
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getTodayTasks = async (req, res, next) => {
  try {
    const { phoneNumber } = req.query;
    
    if (!phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        error: 'Phone number is required' 
      });
    }
    
    const tasks = await taskService.getTasksDueToday(phoneNumber);
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};