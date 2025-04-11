import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays, subDays, parseISO, isToday, isSameDay } from 'date-fns';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';

function DateNavigator({ selectedDate, onChange }) {
  const navigate = useNavigate();
  const today = new Date();
  const dateObj = selectedDate ? parseISO(selectedDate) : today;
  
  const handlePrevDay = () => {
    const prevDay = subDays(dateObj, 1);
    handleDateChange(prevDay);
  };
  
  const handleNextDay = () => {
    const nextDay = addDays(dateObj, 1);
    handleDateChange(nextDay);
  };
  
  const handleTodayClick = () => {
    handleDateChange(today);
  };
  
  const handleDateChange = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    onChange(formattedDate);
    
    // Update URL
    navigate(`/tasks/${formattedDate}`);
  };
  
  const handleDateInputChange = (e) => {
    const dateString = e.target.value;
    handleDateChange(parseISO(dateString));
  };
  
  return (
    <div className="date-navigator">
      <button 
        className="nav-btn" 
        onClick={handlePrevDay}
        aria-label="Previous day"
      >
        <FiChevronLeft size={20} />
      </button>
      
      <div className="date-display">
        <input
          type="date"
          value={format(dateObj, 'yyyy-MM-dd')}
          onChange={handleDateInputChange}
          className="date-input"
        />
        <div className="date-info">
          <div className="selected-date">{format(dateObj, 'EEEE, MMMM d')}</div>
          {isToday(dateObj) && <div className="today-badge">Today</div>}
        </div>
      </div>
      
      <button 
        className="nav-btn" 
        onClick={handleNextDay}
        aria-label="Next day"
      >
        <FiChevronRight size={20} />
      </button>
      
      {!isToday(dateObj) && (
        <button 
          className="today-btn" 
          onClick={handleTodayClick}
          aria-label="Go to today"
        >
          <FiCalendar size={16} />
          <span>Today</span>
        </button>
      )}
      
      <style jsx="true">{`
        .date-navigator {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin: var(--spacing-lg) 0;
        }
        
        .nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--color-card);
          color: var(--color-text);
          box-shadow: var(--shadow-sm);
          transition: all 0.2s ease;
        }
        
        .nav-btn:hover {
          background-color: var(--color-primary-light);
          color: var(--color-primary-dark);
          box-shadow: var(--shadow-md);
        }
        
        .date-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          flex: 1;
        }
        
        .date-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          z-index: 2;
        }
        
        .date-info {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .selected-date {
          font-size: var(--font-size-xl);
          font-weight: 600;
          color: var(--color-text);
        }
        
        .today-badge {
          background-color: var(--color-primary);
          color: white;
          font-size: var(--font-size-xs);
          font-weight: 500;
          padding: 2px var(--spacing-xs);
          border-radius: var(--border-radius-sm);
          margin-top: 2px;
        }
        
        .today-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--border-radius-md);
          background-color: var(--color-primary-light);
          color: var(--color-primary-dark);
          font-weight: 500;
          font-size: var(--font-size-sm);
          transition: all 0.2s ease;
        }
        
        .today-btn:hover {
          background-color: var(--color-primary);
          color: white;
        }
        
        @media (max-width: 640px) {
          .selected-date {
            font-size: var(--font-size-lg);
          }
        }
      `}</style>
    </div>
  );
}

export default DateNavigator; 