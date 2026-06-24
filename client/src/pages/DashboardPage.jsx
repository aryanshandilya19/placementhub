import { Link } from 'react-router-dom';
import { useLogout } from '../features/auth/hooks/useAuth.js';
import useAuthStore from '../store/authStore.js';

function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { logoutUser, loading } = useLogout();

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Welcome, {user?.name}!</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/profile" className="btn-primary">My Profile</Link>
          <button onClick={logoutUser} disabled={loading} className="btn-primary" style={{ background: '#dc2626' }}>
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Email', value: user?.email },
          { label: 'Role', value: user?.role },
          { label: 'Email Verified', value: user?.isEmailVerified ? 'Yes' : 'No' },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{label}</p>
            <p style={{ fontWeight: '600', marginTop: '0.25rem' }}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;