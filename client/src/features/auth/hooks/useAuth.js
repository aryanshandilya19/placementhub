import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginAPI, registerAPI, logoutAPI } from '../../../api/auth.api.js';
import useAuthStore from '../../../store/authStore.js';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const login = async (formData) => {
    setLoading(true);
    try {
      const res = await loginAPI(formData);
      setAuth(res.data.user, res.data.accessToken);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const register = async (formData) => {
    setLoading(true);
    try {
      await registerAPI(formData);
      toast.success('Account created! Please check your email to verify your account.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return { register, loading };
};

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const logoutUser = async () => {
    setLoading(true);
    try {
      await logoutAPI();
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      logout();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return { logoutUser, loading };
};