/**
 * Message Parser - Parses incoming WhatsApp messages
 * 
 * Expected format for task creation:
 * "Task: Buy groceries, Due: tomorrow 5pm, Priority: High, Course: Math"
 * 
 * All fields except "Task" are optional
 */
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const relativeTime = require('dayjs/plugin/relativeTime');

// Extend dayjs with plugins
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

/**
 * Parse a message to identify task details
 * @param {String} message - Incoming message from WhatsApp
 * @returns {Object} Parsing result with validation status and parsed data
 */
function parseTaskMessage(message) {
  // Initialize result object with defaults
  const result = { 
    isValid: false,
    parsedData: null,
    errorMessage: null
  };

  try {
    // Check if message is too short to be valid
    if (!message || message.length < 5) {
      result.errorMessage = "Message is too short. Please include at least a task description.";
      return result;
    }

    // Extract task description - it's required
    let description = null;
    const taskMatch = message.match(/task:\s*([^,]+)/i);
    
    if (taskMatch && taskMatch[1].trim()) {
      description = taskMatch[1].trim();
    } else {
      // If no "Task:" keyword, assume the entire message is the task
      description = message.trim();
    }

    // Parse due date (default to today if not specified)
    let dueDate = dayjs().hour(12).minute(0).second(0).toDate();
    const dueMatch = message.match(/due:\s*([^,]+)/i);
    
    if (dueMatch && dueMatch[1].trim()) {
      const dueDateText = dueMatch[1].trim().toLowerCase();
      
      // Handle common date expressions
      if (dueDateText === 'today') {
        dueDate = dayjs().endOf('day').toDate();
      } else if (dueDateText === 'tomorrow') {
        dueDate = dayjs().add(1, 'day').startOf('day').toDate();
      } else if (dueDateText.includes('today at') || dueDateText.includes('today')) {
        const timeMatch = dueDateText.match(/(\d+)(?::(\d+))?\s*(am|pm)?/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
          const ampm = timeMatch[3] ? timeMatch[3].toLowerCase() : null;
          
          if (ampm === 'pm' && hours < 12) hours += 12;
          if (ampm === 'am' && hours === 12) hours = 0;
          
          dueDate = dayjs().hour(hours).minute(minutes).second(0).toDate();
        }
      } else if (dueDateText.includes('tomorrow at') || dueDateText.includes('tomorrow')) {
        const timeMatch = dueDateText.match(/(\d+)(?::(\d+))?\s*(am|pm)?/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
          const ampm = timeMatch[3] ? timeMatch[3].toLowerCase() : null;
          
          if (ampm === 'pm' && hours < 12) hours += 12;
          if (ampm === 'am' && hours === 12) hours = 0;
          
          dueDate = dayjs().add(1, 'day').hour(hours).minute(minutes).second(0).toDate();
        }
      } else {
        // Try to parse specific date (MM/DD/YYYY or DD/MM/YYYY format)
        const dateMatch = dueDateText.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/);
        if (dateMatch) {
          const month = parseInt(dateMatch[1]) - 1; // 0-indexed month
          const day = parseInt(dateMatch[2]);
          const year = dateMatch[3] ? parseInt(dateMatch[3]) : dayjs().year();
          
          // Create a new dayjs object for the specific date
          dueDate = dayjs()
            .year(year)
            .month(month)
            .date(day)
            .hour(12)
            .minute(0)
            .second(0)
            .toDate();
        }
      }
    }

    // Parse priority (default to Medium)
    let priority = 'Medium';
    const priorityMatch = message.match(/priority:\s*([^,]+)/i);
    
    if (priorityMatch && priorityMatch[1].trim()) {
      const priorityText = priorityMatch[1].trim().toLowerCase();
      
      if (['low', 'medium', 'high'].includes(priorityText)) {
        priority = priorityText.charAt(0).toUpperCase() + priorityText.slice(1);
      }
    }

    // Parse course (optional)
    let course = null;
    const courseMatch = message.match(/course:\s*([^,]+)/i);
    
    if (courseMatch && courseMatch[1].trim()) {
      course = courseMatch[1].trim();
    }

    // Build the parsed data object
    result.isValid = true;
    result.parsedData = {
      description,
      dueDate,
      priority,
      course
    };
  } catch (error) {
    console.error('Error parsing message:', error);
    result.errorMessage = "Could not parse your message. Please try again using the format: Task: description, Due: date, Priority: level, Course: name";
  }

  return result;
}

/**
 * Parse a command message to determine the action
 * @param {String} message - Incoming message from WhatsApp
 * @returns {Object} Command type and parameters
 */
function parseCommandMessage(message) {
  if (!message) return { command: null, params: {} };
  
  const normalizedMessage = message.trim().toLowerCase();
  const firstWord = normalizedMessage.split(' ')[0];
  
  // Check for command type
  if (['hi', 'hello', '?', 'hola', 'hey', 'help'].includes(normalizedMessage)) {
    return { command: 'help', params: {} };
  } 
  
  // Check for "show today" first
  if (normalizedMessage === 'show today' || normalizedMessage === 'today' || normalizedMessage === 'agenda') {
    return { command: 'showToday', params: {} };
  }
  
  // Then check for other show commands
  if (firstWord === 'show' || normalizedMessage === 'tasks') {
    return { command: 'showTasks', params: {} };
  }
  
  if (firstWord === 'delete') {
    const taskNumberMatch = normalizedMessage.match(/delete\s+(\d+)/i);
    const taskNumber = taskNumberMatch && taskNumberMatch[1] ? taskNumberMatch[1].trim() : null;
    
    return { 
      command: 'deleteTask', 
      params: { taskNumber } 
    };
  }
  
  if (firstWord === 'done' || firstWord === 'complete') {
    const taskNumberMatch = normalizedMessage.match(/(done|complete)\s+(\d+)/i);
    const taskNumber = taskNumberMatch && taskNumberMatch[2] ? taskNumberMatch[2].trim() : null;
    
    return { 
      command: 'markDone', 
      params: { taskNumber } 
    };
  }
  
  // If no command matches, assume it's a task creation
  return { command: 'createTask', params: {} };
}

module.exports = {
  parseTaskMessage,
  parseCommandMessage
};