/**
 * Task Routes - API endpoints for task operations
 */
const express = require('express');
const taskController = require('../controllers/taskController');
const router = express.Router();

// Route: /api/tasks
router
  .route('/')
  .get(taskController.getTasks)
  .post(taskController.createTask);

// Route: /api/tasks/today
router
  .route('/today')
  .get(taskController.getTodayTasks);

// Route: /api/tasks/:id
router
  .route('/:id')
  .get(taskController.getTask)
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;