import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { FiPlus } from 'react-icons/fi';

import TaskList from '../components/TaskList';
import DateNavigator from '../components/DateNavigator';
import TaskForm from '../components/TaskForm';
import Modal from '../components/Modal';
import taskApi from '../services/api';

function TaskPage() {
  const { date } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(date || format(new Date(), 'yyyy-MM-dd'));
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // If date is provided in URL, use it
    if (date) {
      setSelectedDate(date);
    } else {
      // Otherwise redirect to today's date
      navigate(`/tasks/${format(new Date(), 'yyyy-MM-dd')}`);
    }
  }, [date, navigate]);
  
  useEffect(() => {
    // Fetch tasks for selected date
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Example API call to get tasks for the selected date
        const response = await taskApi.getTasksByDate(selectedDate);
        setTasks(response);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (selectedDate) {
      fetchTasks();
    }
  }, [selectedDate]);
  
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };
  
  const handleAddTask = () => {
    setEditingTask(null);
    setModalOpen(true);
  };
  
  const handleEditTask = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };
  
  const handleTaskFormSubmit = async (taskData) => {
    try {
      let updatedTask;
      
      if (editingTask) {
        // Update existing task
        updatedTask = await taskApi.updateTask(editingTask._id, taskData);
        setTasks(tasks.map(task => 
          task._id === updatedTask._id ? updatedTask : task
        ));
      } else {
        // Create new task
        updatedTask = await taskApi.createTask(taskData);
        setTasks([...tasks, updatedTask]);
      }
      
      setModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error('Error saving task:', err);
      setError('Failed to save task. Please try again.');
    }
  };
  
  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ));
  };
  
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task._id !== taskId));
  };
  
  return (
    <div className="task-page">
      <DateNavigator 
        selectedDate={selectedDate} 
        onChange={handleDateChange} 
      />
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      ) : (
        <>
          <TaskList 
            tasks={tasks} 
            onTaskUpdate={handleTaskUpdate}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
          />
          
          <button className="fab" onClick={handleAddTask} aria-label="Add new task">
            <FiPlus size={24} />
          </button>
        </>
      )}
      
      <Modal isOpen={modalOpen} onClose={handleCloseModal}>
        <TaskForm 
          task={editingTask}
          onSubmit={handleTaskFormSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
      
      <style jsx="true">{`
        .task-page {
          padding: var(--spacing-lg) 0;
          position: relative;
          min-height: 70vh;
        }
        
        .error-message {
          background-color: rgba(244, 67, 54, 0.1);
          color: var(--color-danger);
          padding: var(--spacing-md);
          border-radius: var(--border-radius-md);
          margin-bottom: var(--spacing-lg);
          text-align: center;
        }
        
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-xl) 0;
          color: var(--color-text-light);
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: var(--color-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: var(--spacing-md);
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .fab {
          position: fixed;
          bottom: var(--spacing-xl);
          right: var(--spacing-xl);
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: var(--color-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-lg);
          transition: all 0.2s ease;
          z-index: 10;
        }
        
        .fab:hover {
          background-color: var(--color-primary-dark);
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .fab {
            bottom: var(--spacing-lg);
            right: var(--spacing-lg);
          }
        }
      `}</style>
    </div>
  );
}

export default TaskPage; 