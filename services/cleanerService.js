// services/cleanerService.js
import api from "@/utils/axiosConfig";

/** ------- Current user (Djoser) ------- */
// JSON read/write for user fields (name, phone_number, gender, address)
export const getCurrentUser = () => api.get("/auth/users/me/");
export const patchCurrentUser = (data) => api.patch("/auth/users/me/", data);

// Multipart for avatar upload (profile_picture)
export const patchCurrentUserMultipart = (formData) =>
  api.patch("/auth/users/me/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/** ------- Cleaner self (your new ViewSet) ------- */
export const getCleanerMe = () => api.get("/api/users/cleaners/me/");
export const patchCleanerMe = (data) => api.patch("/api/users/cleaners/me/", data);

/** ------- Get all cleaners (for candidates listing) ------- */
export const getAllCleaners = (params) => {
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
  return api.get(`/api/users/cleaners/${queryString}`);
};

export const getCleanerById = (id) => api.get(`/api/users/cleaners/${id}/`);

/** ----- Jobs and Applications ----- */
// Get all jobs (this shows which jobs the cleaner has applied to)
export const getJobs = () => api.get("/api/jobs/");

// Get shortlisted jobs for the cleaner
export const getShortlistedJobs = () => api.get("/api/shortlist/");

// Apply to a specific job
export const applyToJob = (jobId, data) => api.post(`/api/jobs/${jobId}/applications/`, data);

// Get job metrics (this endpoint exists)
export const getJobMetrics = () => api.get("/api/jobs/");

// Get applications for a specific job (this endpoint exists - for employers)
export const getJobApplications = (jobId) => api.get(`/api/jobs/${jobId}/applications/`);

/** ----- Messages (when endpoint is available) ----- */
export const getUnreadMessagesCount = () => api.get("/api/chat/unread/count/");

/** ----- Job alerts/saved jobs (when endpoint is available) ----- */
export const getSavedJobs = () => api.get("/api/jobs/saved/");

/** ----- Reviews ----- */
export const getCleanerReviews = () => api.get("/api/reviews/my/");

/** ----- Upload functions ----- */
export const uploadUserAvatar = async (file) => {
  const formData = new FormData();
  formData.append("profile_picture", file);

  return patchCurrentUserMultipart(formData);
};
