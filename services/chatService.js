import apiClient from "@/utils/axiosConfig";

// Note: The 'apiClient' should be configured to handle the JWT automatically.

export const listChats = (params = {}) => {
  // params could be { include_archived: 1 }
  return apiClient.get("/api/chats/", { params });
};

export const createChat = ({ employer, cleaner }) => {
  return apiClient.post("/api/chats/", { employer, cleaner });
};

export const archiveChat = (chatId, reason = "") => {
  return apiClient.post(`/api/chats/${chatId}/archive/`, { reason });
};

export const flagChat = ({ chat, reason }) => {
  return apiClient.post("/api/flagged-chats/", { chat, reason });
};

export const listFlaggedChats = (params = {}) => {
  // params could be { resolved: false }
  return apiClient.get("/api/flagged-chats/", { params });
};

export const resolveFlaggedChat = (flagId, { resolved, resolution_notes }) => {
  return apiClient.patch(`/api/flagged-chats/${flagId}/`, {
    resolved,
    resolution_notes,
  });
};
