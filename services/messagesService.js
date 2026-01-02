import apiClient from "@/utils/axiosConfig";

export const listChatMessages = (chatId, params = {}) => {
  return apiClient.get(`/api/messages/chat/${chatId}/messages`, { params });
};

export const sendMessage = ({ chat, content }) => {
  return apiClient.post("/api/messages/", { chat, content });
};

export const getUnreadCount = () => {
  return apiClient.get("/api/messages/unread-count");
};

export const markMessageRead = (messageId) => {
  return apiClient.post(`/api/messages/${messageId}/mark-as-read/`);
};

export const markAllRead = (chatId) => {
  return apiClient.post(`/api/messages/chat/${chatId}/mark-all-read/`);
};