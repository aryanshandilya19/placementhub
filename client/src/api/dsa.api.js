import axiosInstance from './axiosInstance.js';

export const getDSAAPI = async () => {
  const res = await axiosInstance.get('/dsa');
  return res.data;
};

export const addProblemAPI = async (data) => {
  const res = await axiosInstance.post('/dsa/problems', data);
  return res.data;
};

export const updateProblemAPI = async (problemId, data) => {
  const res = await axiosInstance.patch(`/dsa/problems/${problemId}`, data);
  return res.data;
};

export const deleteProblemAPI = async (problemId) => {
  const res = await axiosInstance.delete(`/dsa/problems/${problemId}`);
  return res.data;
};