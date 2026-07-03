import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', fontWeight: '800', color: '#4f46e5', marginBottom: '0.5rem' }}>
          404
        </div>
        <h1 className="auth-title">Page not found</h1>
        <p className="auth-subtitle">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard" className="btn-primary" style={{ display: 'block', marginTop: '1.5rem' }}>
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;