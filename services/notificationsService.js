import apiClient from "@/utils/axiosConfig";

export const fetchNotifications = (params = {}) => {
  return apiClient.get("/api/notifications/", { params });
};

export const fetchUnreadNotificationCount = () => {
  return apiClient.get("/api/notifications/unread_count/");
};

export const markNotificationAsRead = (notificationId) => {
  return apiClient.post(`/api/notifications/${notificationId}/mark_as_read/`);
};

export const markAllNotificationsAsRead = () => {
  return apiClient.post("/api/notifications/mark_all_as_read/");
};
