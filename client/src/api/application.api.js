import axiosInstance from './axiosInstance.js';

export const getApplicationsAPI = async (params = {}) => {
  const res = await axiosInstance.get('/applications', { params });
  return res.data;
};

export const createApplicationAPI = async (data) => {
  const res = await axiosInstance.post('/applications', data);
  return res.data;
};

export const updateApplicationAPI = async (id, data) => {
  const res = await axiosInstance.patch(`/applications/${id}`, data);
  return res.data;
};

export const deleteApplicationAPI = async (id) => {
  const res = await axiosInstance.delete(`/applications/${id}`);
  return res.data;
};

export const addRoundAPI = async (id, data) => {
  const res = await axiosInstance.post(`/applications/${id}/rounds`, data);
  return res.data;
};

export const getStatsAPI = async () => {
  const res = await axiosInstance.get('/applications/stats');
  return res.data;
};