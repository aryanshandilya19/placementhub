import { Link } from 'react-router-dom';
import { useLogout } from '../features/auth/hooks/useAuth.js';
import useAuthStore from '../store/authStore.js';

function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { logoutUser, loading } = useLogout();

  const navItems = [
    { label: 'My Profile', to: '/profile', color: '#4f46e5' },
    { label: 'Applications', to: '/applications', color: '#0891b2' },
    { label: 'DSA Tracker', to: '/dsa', color: '#7c3aed' },
    { label: 'Analytics', to: '/analytics', color: '#059669' },
    ...(user?.role === 'admin' ? [{ label: 'Admin Panel', to: '/admin', color: '#dc2626' }] : []),
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Here's your placement journey at a glance.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {navItems.map(({ label, to, color }) => (
          <Link key={to} to={to} style={{
            background: 'white', padding: '1.5rem', borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textDecoration: 'none',
            color, fontWeight: '600', fontSize: '1rem',
            borderLeft: `4px solid ${color}`,
          }}>
            {label} →
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;