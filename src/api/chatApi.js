import axiosClient from './axiosClient';

export const listConversations = async () => {
  const response = await axiosClient.get('/api/chat');
  return response.data;
};

export const getConversationMessages = async (conversationId) => {
  const response = await axiosClient.get(`/api/chat/${conversationId}/messages`);
  return response.data;
};