import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FiX, FiCalendar, FiClock, FiFlag, FiBookOpen } from 'react-icons/fi';

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    dueTime: format(new Date(), 'HH:mm'),
    priority: 'Medium',
    course: '',
    status: 'New'
  });

  useEffect(() => {
    if (task) {
      const dueDate = new Date(task.dueDate);
      setFormData({
        description: task.description || '',
        dueDate: format(dueDate, 'yyyy-MM-dd'),
        dueTime: format(dueDate, 'HH:mm'),
        priority: task.priority || 'Medium',
        course: task.course || '',
        status: task.status || 'New'
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Combine date and time into one Date object
    const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);
    
    onSubmit({
      ...formData,
      dueDate: dueDateTime.toISOString()
    });
  };

  return (
    <div className="task-form-container">
      <div className="task-form-header">
        <h2>{task ? 'Edit Task' : 'Add New Task'}</h2>
        <button type="button" className="close-btn" onClick={onCancel}>
          <FiX size={24} />
        </button>
      </div>
      
      <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">Task Description</label>
          <textarea 
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What do you need to do?"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dueDate" className="icon-label">
              <FiCalendar /> Due Date
            </label>
            <input 
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="dueTime" className="icon-label">
              <FiClock /> Due Time
            </label>
            <input 
              type="time"
              id="dueTime"
              name="dueTime"
              value={formData.dueTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority" className="icon-label">
              <FiFlag /> Priority
            </label>
            <select 
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="course" className="icon-label">
              <FiBookOpen /> Course (optional)
            </label>
            <input 
              type="text"
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="E.g., Math 101"
            />
          </div>
        </div>
        
        {task && (
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select 
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        )}
        
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn btn-outline">Cancel</button>
          <button type="submit" className="btn btn-primary">
            {task ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </form>
      
      <style jsx="true">{`
        .task-form-container {
          background-color: var(--color-card);
          border-radius: var(--border-radius-md);
          box-shadow: var(--shadow-lg);
          max-width: 600px;
          width: 100%;
          overflow: hidden;
        }
        
        .task-form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-md);
          background-color: var(--color-primary);
          color: white;
        }
        
        .task-form-header h2 {
          font-size: var(--font-size-xl);
          font-weight: 600;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: var(--spacing-xs);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s;
        }
        
        .close-btn:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        .task-form {
          padding: var(--spacing-lg);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }
        
        .form-row {
          display: flex;
          gap: var(--spacing-md);
        }
        
        .form-row .form-group {
          flex: 1;
        }
        
        label {
          font-weight: 500;
          color: var(--color-text);
        }
        
        .icon-label {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }
        
        input, select, textarea {
          padding: var(--spacing-sm);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-sm);
          background-color: white;
          transition: border-color 0.2s;
        }
        
        input:focus, select:focus, textarea:focus {
          border-color: var(--color-primary);
        }
        
        textarea {
          min-height: 100px;
          resize: vertical;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--spacing-md);
          margin-top: var(--spacing-md);
        }
        
        @media (max-width: 600px) {
          .form-row {
            flex-direction: column;
            gap: var(--spacing-md);
          }
        }
      `}</style>
    </div>
  );
};

export default TaskForm; 