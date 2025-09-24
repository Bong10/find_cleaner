// /services/shortlistService.js
import api from "@/utils/axiosConfig";

// List employer-scoped shortlist (backend already scopes by auth user)
export const listShortlist = (params = {}) =>
  api.get("/api/shortlist/", { params });

// Remove from shortlist
export const deleteShortlist = (shortlistId) =>
  api.delete(`/api/shortlist/${shortlistId}/`);

// (Optional) Add to shortlist: body { job, cleaner }
export const addShortlist = (payload) =>
  api.post("/api/shortlist/", payload);
