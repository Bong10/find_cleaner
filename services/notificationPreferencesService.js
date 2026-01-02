import api from "@/utils/axiosConfig";

/**
 * Notification Preferences API (Django DRF)
 *
 * Endpoints:
 * - GET    /api/preferences/
 * - PATCH  /api/preferences/
 * - PUT    /api/preferences/
 * - POST   /api/preferences/reset/
 * - GET    /api/preferences/available-events/
 */

export const getNotificationPreferences = async () => {
  const { data } = await api.get("/api/preferences/");
  return data;
};

export const patchNotificationPreferences = async (payload) => {
  const { data } = await api.patch("/api/preferences/", payload);
  return data;
};

export const resetNotificationPreferences = async () => {
  const { data } = await api.post("/api/preferences/reset/", {});
  return data;
};

export const getAvailableNotificationEvents = async () => {
  const { data } = await api.get("/api/preferences/available-events/");
  return data;
};
