import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import AppLayout from '../components/layout/AppLayout.jsx';

function AdminRoute({ children }) {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return <AppLayout>{children}</AppLayout>;
}

export default AdminRoute;