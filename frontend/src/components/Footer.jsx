import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Academic Task Manager</p>
          <p className="footer-tagline">Powered by WhatsApp</p>
        </div>
      </div>
      <style jsx="true">{`
        .footer {
          margin-top: auto;
          padding: var(--spacing-md) 0;
          background-color: var(--color-primary-dark);
          color: white;
          font-size: var(--font-size-sm);
        }
        
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .footer-tagline {
          font-style: italic;
        }
        
        @media (max-width: 600px) {
          .footer-content {
            flex-direction: column;
            gap: var(--spacing-xs);
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer; 