// services/employerService.js
import api from "@/utils/axiosConfig";

// ----- Current user (Djoser) -----
export const getCurrentUser = () => api.get("/auth/users/me/");
export const patchCurrentUser = (data) => api.patch("/auth/users/me/", data);
export const patchCurrentUserMultipart = (formData) =>
  api.patch("/auth/users/me/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ----- Employer self (your new ViewSet) -----
export const getEmployerMe = () => api.get("/api/users/employers/me/");
export const patchEmployerMe = (data) => api.patch("/api/users/employers/me/", data);
export const patchEmployerMeMultipart = (formData) =>
  api.patch("/api/users/employers/me/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
