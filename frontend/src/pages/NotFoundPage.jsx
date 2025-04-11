import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="back-link">
          <FiArrowLeft />
          <span>Back to Tasks</span>
        </Link>
      </div>
      
      <style jsx="true">{`
        .not-found-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          padding: var(--spacing-xl);
        }
        
        .not-found-content {
          max-width: 600px;
        }
        
        h1 {
          font-size: 6rem;
          color: var(--color-primary);
          margin-bottom: var(--spacing-sm);
        }
        
        h2 {
          font-size: 2rem;
          margin-bottom: var(--spacing-lg);
          color: var(--color-text);
        }
        
        p {
          color: var(--color-text-light);
          margin-bottom: var(--spacing-xl);
        }
        
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--border-radius-md);
          background-color: var(--color-primary);
          color: white;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .back-link:hover {
          background-color: var(--color-primary-dark);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

export default NotFoundPage; 