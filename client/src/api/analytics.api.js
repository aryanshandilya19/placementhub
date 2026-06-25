import axiosInstance from './axiosInstance.js';

export const getDashboardAnalyticsAPI = async () => {
  const res = await axiosInstance.get('/analytics/dashboard');
  return res.data;
};