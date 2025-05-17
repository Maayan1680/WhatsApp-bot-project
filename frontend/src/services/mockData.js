// Mock data for development
import { addDays, subDays, startOfDay, setHours, setMinutes } from 'date-fns';

// Helper to create a task with a specific date offset from today
const createTask = (id, description, daysOffset, hours, minutes, priority = 'Medium', course = null, status = 'New') => {
  const today = new Date();
  const dueDate = setMinutes(setHours(startOfDay(addDays(today, daysOffset)), hours), minutes);
  
  return {
    _id: `task_${id}`,
    description,
    dueDate: dueDate.toISOString(),
    priority,
    course,
    status,
    userId: 'mock_user_id'
  };
};

// Generate some sample tasks
const generateMockTasks = () => {
  return [
    createTask(1, "Complete Math Assignment", 0, 14, 30, "High", "Mathematics 101"),
    createTask(2, "Read Chapter 5 of History Textbook", 0, 18, 0, "Medium", "History 202"),
    createTask(3, "Prepare for Physics Lab", 0, 10, 0, "High", "Physics 221"),
    createTask(4, "Submit Research Paper Draft", 1, 23, 59, "High", "English 305"),
    createTask(5, "Group Project Meeting", 1, 15, 30, "Medium", "Computer Science 240"),
    createTask(6, "Study for Midterm Exam", 2, 12, 0, "High", "Biology 110"),
    createTask(7, "Complete Online Quiz", -1, 16, 0, "Low", "Psychology 101", "Done"),
    createTask(8, "Library Research", -1, 10, 30, "Medium", "Sociology 220", "Done"),
    createTask(9, "Practice Presentation", 3, 17, 0, "Medium", "Communications 215"),
    createTask(10, "Review Lecture Notes", 4, 19, 0, "Low", "Economics 101"),
    createTask(11, "Gym Workout", -2, 7, 30, "Low", null, "Done"),
    createTask(12, "Club Meeting", 5, 16, 30, "Medium", null),
  ];
};

const mockTasks = generateMockTasks();

export default mockTasks; 