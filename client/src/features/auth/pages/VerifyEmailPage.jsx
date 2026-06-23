import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyEmailAPI } from '../../../api/auth.api.js';

function VerifyEmailPage() {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmailAPI(token);
        setStatus('success');
      } catch {
        setStatus('error');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        {status === 'verifying' && <p>Verifying your email...</p>}
        {status === 'success' && (
          <>
            <h1 className="auth-title">Email verified!</h1>
            <p>Your account is now active.</p>
            <Link to="/login" className="btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: '1rem' }}>
              Go to login
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="auth-title">Verification failed</h1>
            <p>This link is invalid or has expired. Please register again.</p>
            <Link to="/register" className="btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: '1rem' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmailPage;