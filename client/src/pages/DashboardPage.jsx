import { useLogout } from '../features/auth/hooks/useAuth.js';
import useAuthStore from '../store/authStore.js';

function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { logoutUser, loading } = useLogout();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <p>Email verified: {user?.isEmailVerified ? 'Yes' : 'No'}</p>
      <button onClick={logoutUser} disabled={loading}>
        {loading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}

export default DashboardPage;