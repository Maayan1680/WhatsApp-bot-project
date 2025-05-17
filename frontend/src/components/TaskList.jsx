import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { FiEdit2, FiTrash2, FiCalendar, FiClock, FiBookOpen } from 'react-icons/fi';
import taskApi from '../services/api';

function TaskList({ tasks, onTaskUpdate, onDeleteTask, onEditTask }) {
  const [expandedTasks, setExpandedTasks] = useState({});

  const toggleExpand = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleMarkDone = async (task) => {
    try {
      const updatedTask = await taskApi.markTaskAsDone(task._id);
      onTaskUpdate(updatedTask);
    } catch (error) {
      console.error('Error marking task as done:', error);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApi.deleteTask(taskId);
        onDeleteTask(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="no-tasks">
        <p>No tasks for this day. Enjoy your free time! 😊</p>
        <style jsx="true">{`
          .no-tasks {
            text-align: center;
            padding: var(--spacing-xl) 0;
            color: var(--color-text-light);
            font-size: var(--font-size-lg);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <div 
          key={task._id} 
          className={`task-item ${task.status === 'Done' ? 'task-done' : ''}`}
          onClick={() => toggleExpand(task._id)}
        >
          <div className="task-header">
            <div className="task-checkbox-container">
              <input
                type="checkbox"
                className="task-checkbox"
                checked={task.status === 'Done'}
                onChange={(e) => {
                  e.stopPropagation();
                  if (!task.status === 'Done') {
                    handleMarkDone(task);
                  }
                }}
              />
              <span className="task-title">{task.description}</span>
            </div>
            <div className={`task-priority ${getPriorityClass(task.priority)}`}>
              {task.priority}
            </div>
          </div>
          
          {expandedTasks[task._id] && (
            <div className="task-details" onClick={(e) => e.stopPropagation()}>
              <div className="task-info">
                <div className="task-info-item">
                  <FiCalendar />
                  <span>Due: {format(parseISO(task.dueDate), 'MMM d, yyyy')}</span>
                </div>
                <div className="task-info-item">
                  <FiClock />
                  <span>Time: {format(parseISO(task.dueDate), 'h:mm a')}</span>
                </div>
                {task.course && (
                  <div className="task-info-item">
                    <FiBookOpen />
                    <span>Course: {task.course}</span>
                  </div>
                )}
              </div>
              <div className="task-actions">
                <button 
                  className="task-action-btn edit" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditTask(task);
                  }}
                >
                  <FiEdit2 /> Edit
                </button>
                <button 
                  className="task-action-btn delete" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(task._id);
                  }}
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      
      <style jsx="true">{`
        .task-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          margin: var(--spacing-lg) 0;
        }
        
        .task-item {
          background-color: var(--color-card);
          border-radius: var(--border-radius-md);
          box-shadow: var(--shadow-sm);
          padding: var(--spacing-md);
          cursor: pointer;
          transition: all 0.2s ease;
          border-left: 4px solid var(--color-primary);
        }
        
        .task-item:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
        
        .task-done {
          opacity: 0.7;
          border-left-color: var(--color-success);
        }
        
        .task-done .task-title {
          text-decoration: line-through;
          color: var(--color-text-light);
        }
        
        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--spacing-md);
        }
        
        .task-checkbox-container {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          flex: 1;
        }
        
        .task-checkbox {
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: var(--color-primary);
        }
        
        .task-title {
          font-weight: 500;
          font-size: var(--font-size-md);
        }
        
        .task-priority {
          font-size: var(--font-size-xs);
          font-weight: 600;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--border-radius-sm);
          text-transform: uppercase;
        }
        
        .task-details {
          margin-top: var(--spacing-md);
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--color-border);
        }
        
        .task-info {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }
        
        .task-info-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          color: var(--color-text-light);
          font-size: var(--font-size-sm);
        }
        
        .task-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: flex-end;
        }
        
        .task-action-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--border-radius-sm);
          font-size: var(--font-size-sm);
          font-weight: 500;
        }
        
        .task-action-btn.edit {
          color: var(--color-info);
        }
        
        .task-action-btn.delete {
          color: var(--color-danger);
        }
        
        @media (max-width: 640px) {
          .task-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-sm);
          }
          
          .task-actions {
            justify-content: space-between;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default TaskList; 