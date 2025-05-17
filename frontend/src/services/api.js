import axios from 'axios';
import mockTasks from './mockData';
import { parseISO, format, isEqual, startOfDay } from 'date-fns';

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

// Create axios instance with baseURL
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Mock API functions for development
const mockApi = {
  // Get all tasks
  getTasks: async (filters = {}) => {
    // Wait to simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredTasks = [...mockTasks];

    // Apply filters if provided
    if (filters.status) {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }

    if (filters.priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
    }

    if (filters.course) {
      filteredTasks = filteredTasks.filter(task => task.course === filters.course);
    }

    return filteredTasks;
  },

  // Get tasks for a specific date
  getTasksByDate: async (date) => {
    // Wait to simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const selectedDate = startOfDay(parseISO(date));
    
    return mockTasks.filter(task => {
      const taskDate = startOfDay(parseISO(task.dueDate));
      return isEqual(taskDate, selectedDate);
    });
  },

  // Get task by ID
  getTaskById: async (id) => {
    // Wait to simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const task = mockTasks.find(task => task._id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  },

  // Create a new task
  createTask: async (taskData) => {
    // Wait to simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate new ID
    const newId = `task_${mockTasks.length + 1}_${Date.now().toString().substring(7)}`;
    
    const newTask = {
      _id: newId,
      ...taskData,
      userId: 'mock_user_id'
    };
    
    mockTasks.push(newTask);
    return newTask;
  },

  // Update a task
  updateTask: async (id, taskData) => {
    // Wait to simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const taskIndex = mockTasks.findIndex(task => task._id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...mockTasks[taskIndex],
      ...taskData
    };
    
    mockTasks[taskIndex] = updatedTask;
    return updatedTask;
  },

  // Delete a task
  deleteTask: async (id) => {
    // Wait to simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const taskIndex = mockTasks.findIndex(task => task._id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    mockTasks.splice(taskIndex, 1);
    return { success: true };
  },

  // Mark a task as done
  markTaskAsDone: async (id) => {
    // Wait to simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const taskIndex = mockTasks.findIndex(task => task._id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    mockTasks[taskIndex].status = 'Done';
    return mockTasks[taskIndex];
  }
};

// Use the appropriate API based on environment
const taskApi = isDevelopment ? mockApi : {
  // Get all tasks
  getTasks: async (filters = {}) => {
    try {
      const response = await api.get('/tasks', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },
  
  // Get tasks for a specific date
  getTasksByDate: async (date) => {
    try {
      const response = await api.get(`/tasks/date/${date}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks for date ${date}:`, error);
      throw error;
    }
  },
  
  // Get task by ID
  getTaskById: async (id) => {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with id ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new task
  createTask: async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },
  
  // Update a task
  updateTask: async (id, taskData) => {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error(`Error updating task with id ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a task
  deleteTask: async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting task with id ${id}:`, error);
      throw error;
    }
  },
  
  // Mark a task as done
  markTaskAsDone: async (id) => {
    try {
      const response = await api.patch(`/tasks/${id}/done`);
      return response.data;
    } catch (error) {
      console.error(`Error marking task ${id} as done:`, error);
      throw error;
    }
  }
};

export default taskApi; 