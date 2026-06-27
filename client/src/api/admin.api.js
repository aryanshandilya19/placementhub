import axiosInstance from './axiosInstance.js';

export const getAdminStatsAPI = async () => {
  const res = await axiosInstance.get('/admin/stats');
  return res.data;
};

export const getAllUsersAPI = async (params = {}) => {
  const res = await axiosInstance.get('/admin/users', { params });
  return res.data;
};

export const getUserByIdAPI = async (id) => {
  const res = await axiosInstance.get(`/admin/users/${id}`);
  return res.data;
};

export const updateUserRoleAPI = async (id, role) => {
  const res = await axiosInstance.patch(`/admin/users/${id}/role`, { role });
  return res.data;
};

export const deleteUserAPI = async (id) => {
  const res = await axiosInstance.delete(`/admin/users/${id}`);
  return res.data;
};