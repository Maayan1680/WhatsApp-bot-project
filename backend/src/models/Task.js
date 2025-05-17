/**
 * Task model
 */
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  description: { 
    type: String, 
    required: true,
    trim: true
  },
  status: { 
    type: String, 
    enum: ['New', 'In Progress', 'Done'], 
    default: 'New',
    index: true
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Medium',
    index: true
  },
  dueDate: { 
    type: Date, 
    required: true,
    index: true
  },
  course: { 
    type: String,
    trim: true,
    index: true
  }
}, {
  timestamps: true
});

// Add text index for search functionality
taskSchema.index({ description: 'text', course: 'text' });

// Virtual for overdue status
taskSchema.virtual('isOverdue').get(function() {
  return this.status !== 'Done' && this.dueDate < new Date();
});

// Include virtuals when converting to JSON/Object
taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);