import { Link } from 'react-router-dom';
import { format } from 'date-fns';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img src="/whatsapp-icon.svg" alt="WhatsApp Task Manager" width="32" height="32" />
            <span>Academic Task Manager</span>
          </Link>
          <div className="header-right">
            <div className="date">
              <span>{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
            </div>
          </div>
        </div>
      </div>
      <style jsx="true">{`
        .header {
          background-color: var(--color-primary);
          color: white;
          padding: var(--spacing-md) 0;
          box-shadow: var(--shadow-md);
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: white;
          font-weight: 700;
          font-size: var(--font-size-lg);
        }
        
        .header-right {
          display: flex;
          align-items: center;
          gap: var(--spacing-xl);
        }
        
        .date {
          font-size: var(--font-size-sm);
          font-weight: 500;
        }
        
        @media (max-width: 768px) {
          .logo span {
            font-size: var(--font-size-md);
          }
          
          .header-right {
            gap: var(--spacing-md);
          }
        }
      `}</style>
    </header>
  );
}

export default Header; 