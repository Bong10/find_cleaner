// services/cleanerService.js
import api from "@/utils/axiosConfig";

/** ------- Cleaner self (your ViewSet) ------- */
export const getCleanerMe = () => api.get("/api/users/cleaners/me/");
export const patchCleanerMe = (data) => api.patch("/api/users/cleaners/me/", data);

/** ------- Current user (Djoser) ------- */
// JSON read/write for user fields (name, phone_number, gender, address)
export const getCurrentUser = () => api.get("/auth/users/me/");
export const patchCurrentUser = (data) => api.patch("/auth/users/me/", data);

// Multipart for avatar upload (profile_picture)
export const patchCurrentUserMultipart = (formData) =>
  api.patch("/auth/users/me/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/** Convenience helper used by cleanerProfileSlice */
export const uploadUserAvatar = (file) => {
  const fd = new FormData();
  // backend expects the same field name as the model
  fd.append("profile_picture", file);
  return patchCurrentUserMultipart(fd);
};
