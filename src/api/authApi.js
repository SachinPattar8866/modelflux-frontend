import axiosClient from './axiosClient';

export const register = async (email, password) => {
  const response = await axiosClient.post('/auth/register', { email, password });
  return response.data; // { token: "..." }
};

export const login = async (email, password) => {
  const response = await axiosClient.post('/auth/login', { email, password });
  return response.data; // { token: "..." }
};