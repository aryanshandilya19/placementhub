import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';
import { useLogout } from '../../features/auth/hooks/useAuth.js';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Applications', to: '/applications' },
  { label: 'DSA', to: '/dsa' },
  { label: 'Analytics', to: '/analytics' },
  { label: 'Profile', to: '/profile' },
];

function Navbar() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const { logoutUser, loading } = useLogout();

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky', top: 0, zIndex: 50,
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px',
      }}>
        {/* Logo */}
        <Link to="/dashboard" style={{
          fontWeight: '800', fontSize: '1.125rem',
          color: '#4f46e5', textDecoration: 'none',
          letterSpacing: '-0.02em',
        }}>
          Placement<span style={{ color: '#0f172a' }}>Hub</span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          {NAV_ITEMS.map(({ label, to }) => (
            <Link key={to} to={to} style={{
              padding: '0.375rem 0.875rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: isActive(to) ? '600' : '400',
              color: isActive(to) ? '#4f46e5' : '#64748b',
              background: isActive(to) ? '#ede9fe' : 'transparent',
              transition: 'all 0.15s',
            }}>
              {label}
            </Link>
          ))}

          {user?.role === 'admin' && (
            <Link to="/admin" style={{
              padding: '0.375rem 0.875rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: isActive('/admin') ? '600' : '400',
              color: isActive('/admin') ? '#dc2626' : '#64748b',
              background: isActive('/admin') ? '#fee2e2' : 'transparent',
            }}>
              Admin
            </Link>
          )}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img
              src={user?.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=4f46e5&color=fff&size=32`}
              alt="avatar"
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#0f172a' }}>
              {user?.name?.split(' ')[0]}
            </span>
          </div>
          <button
            onClick={logoutUser}
            disabled={loading}
            style={{
              padding: '0.375rem 0.875rem',
              background: 'transparent',
              border: '1.5px solid #e2e8f0',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: '#64748b',
              fontWeight: '500',
            }}>
            {loading ? '...' : 'Logout'}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;