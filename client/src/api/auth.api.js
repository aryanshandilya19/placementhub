import axiosInstance from './axiosInstance.js';

export const registerAPI = async (data) => {
  const response = await axiosInstance.post('/auth/register', data);
  return response.data;
};

export const loginAPI = async (data) => {
  const response = await axiosInstance.post('/auth/login', data);
  return response.data;
};

export const logoutAPI = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
};

export const verifyEmailAPI = async (token) => {
  const response = await axiosInstance.get(`/auth/verify-email/${token}`);
  return response.data;
};

export const forgotPasswordAPI = async (data) => {
  const response = await axiosInstance.post('/auth/forgot-password', data);
  return response.data;
};

export const resetPasswordAPI = async (token, data) => {
  const response = await axiosInstance.post(`/auth/reset-password/${token}`, data);
  return response.data;
};