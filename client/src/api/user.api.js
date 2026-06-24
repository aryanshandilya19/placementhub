import axiosInstance from './axiosInstance.js';

export const getMeAPI = async () => {
  const res = await axiosInstance.get('/users/me');
  return res.data;
};

export const updateProfileAPI = async (data) => {
  const res = await axiosInstance.patch('/users/me', data);
  return res.data;
};

export const uploadAvatarAPI = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  const res = await axiosInstance.post('/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const uploadResumeAPI = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  const res = await axiosInstance.post('/users/me/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteResumeAPI = async () => {
  const res = await axiosInstance.delete('/users/me/resume');
  return res.data;
};