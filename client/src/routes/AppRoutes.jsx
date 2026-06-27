import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage.jsx';
import RegisterPage from '../features/auth/pages/RegisterPage.jsx';
import VerifyEmailPage from '../features/auth/pages/VerifyEmailPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import ProfilePage from '../features/profile/pages/ProfilePage.jsx';
import ApplicationsPage from '../features/applications/pages/ApplicationsPage.jsx';
import DSAPage from '../features/dsa/pages/DSAPage.jsx';
import AnalyticsPage from '../features/analytics/pages/AnalyticsPage.jsx';
import AdminPage from '../features/admin/pages/AdminPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import AdminRoute from './AdminRoute.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/applications" element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>} />
      <Route path="/dsa" element={<ProtectedRoute><DSAPage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;