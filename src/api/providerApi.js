import axiosClient from './axiosClient';

export const getProviderStatus = async () => {
  const response = await axiosClient.get('/api/providers/status');
  return response.data;
};