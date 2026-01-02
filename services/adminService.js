// @/services/adminService.js
import api from "@/utils/axiosConfig";

/**
 * Admin Service - Complete API calls for admin dashboard
 * Based on official backend API documentation
 */

// ==================== Dashboard Stats & Reports ====================

/** Get dashboard overview stats */
export const getDashboardStats = async () => {
  const { data } = await api.get("/api/admin/stats/");
  return data;
};

/** Get user reports */
export const getUserReports = async () => {
  const { data } = await api.get("/api/admin/reports/users/");
  return data;
};

/** Get jobs reports */
export const getJobsReports = async () => {
  const { data } = await api.get("/api/admin/reports/jobs/");
  return data;
};

/** Get security reports */
export const getSecurityReports = async () => {
  const { data } = await api.get("/api/admin/reports/security/");
  return data;
};

// ==================== Cleaners Management ====================

/** Get all cleaners with pagination */
export const getAllCleaners = async (params = {}) => {
  const { data } = await api.get("/api/users/cleaners/", { params });
  return data;
};

/** Get cleaner by ID with full details */
export const getCleanerById = async (id) => {
  const { data } = await api.get(`/api/users/cleaners/${id}/`);
  return data;
};

/** Create new cleaner */
export const createCleaner = async (cleanerData) => {
  const { data } = await api.post("/api/users/cleaners/", cleanerData);
  return data;
};

/** Update cleaner (full update) */
export const updateCleanerFull = async (id, cleanerData) => {
  const { data } = await api.put(`/api/users/cleaners/${id}/`, cleanerData);
  return data;
};

/** Update cleaner (partial update) */
export const updateCleaner = async (id, cleanerData) => {
  const { data } = await api.patch(`/api/users/cleaners/${id}/`, cleanerData);
  return data;
};

/** Delete cleaner */
export const deleteCleaner = async (id) => {
  await api.delete(`/api/users/cleaners/${id}/`);
  return { success: true };
};

/** Activate cleaner */
export const activateCleaner = async (id) => {
  const { data } = await api.post(`/api/users/cleaners/${id}/activate/`);
  return data;
};

/** Deactivate cleaner */
export const deactivateCleaner = async (id) => {
  const { data } = await api.post(`/api/users/cleaners/${id}/deactivate/`);
  return data;
};

// ==================== Employers Management ====================

/** Get all employers with pagination */
export const getAllEmployers = async (params = {}) => {
  const { data } = await api.get("/api/users/employers/", { params });
  return data;
};

/** Get employer by ID with full details */
export const getEmployerById = async (id) => {
  const { data } = await api.get(`/api/users/employers/${id}/`);
  return data;
};

/** Create new employer */
export const createEmployer = async (employerData) => {
  const { data } = await api.post("/api/users/employers/", employerData);
  return data;
};

/** Update employer (full update) */
export const updateEmployerFull = async (id, employerData) => {
  const { data } = await api.put(`/api/users/employers/${id}/`, employerData);
  return data;
};

/** Update employer (partial update) */
export const updateEmployer = async (id, employerData) => {
  const { data } = await api.patch(`/api/users/employers/${id}/`, employerData);
  return data;
};

/** Delete employer */
export const deleteEmployer = async (id) => {
  await api.delete(`/api/users/employers/${id}/`);
  return { success: true };
};

/** Activate employer */
export const activateEmployer = async (id) => {
  const { data } = await api.post(`/api/users/employers/${id}/activate/`);
  return data;
};

/** Deactivate employer */
export const deactivateEmployer = async (id) => {
  const { data } = await api.post(`/api/users/employers/${id}/deactivate/`);
  return data;
};

// ==================== Services Management ====================

/** Get all services */
export const getAllServices = async (params = {}) => {
  const { data } = await api.get("/api/services/", { params });
  return data;
};

/** Get service by ID */
export const getServiceById = async (id) => {
  const { data } = await api.get(`/api/services/${id}/`);
  return data;
};

/** Create new service */
export const createService = async (serviceData) => {
  const { data } = await api.post("/api/services/", serviceData);
  return data;
};

/** Update service (full update) */
export const updateServiceFull = async (id, serviceData) => {
  const { data } = await api.put(`/api/services/${id}/`, serviceData);
  return data;
};

/** Update service (partial update) */
export const updateService = async (id, serviceData) => {
  const { data } = await api.patch(`/api/services/${id}/`, serviceData);
  return data;
};

/** Delete service */
export const deleteService = async (id) => {
  await api.delete(`/api/services/${id}/`);
  return { success: true };
};

// ==================== Service Categories Management ====================

/** Get all service categories */
export const getAllCategories = async (params = {}) => {
  const { data } = await api.get("/api/services/categories/", { params });
  return data;
};

/** Get category by ID */
export const getCategoryById = async (id) => {
  const { data } = await api.get(`/api/services/categories/${id}/`);
  return data;
};

/** Create new category */
export const createCategory = async (categoryData) => {
  const { data } = await api.post("/api/services/categories/", categoryData);
  return data;
};

/** Update category */
export const updateCategory = async (id, categoryData) => {
  const { data } = await api.patch(`/api/services/categories/${id}/`, categoryData);
  return data;
};

/** Delete category */
export const deleteCategory = async (id) => {
  await api.delete(`/api/services/categories/${id}/`);
  return { success: true };
};

// ==================== Jobs Management ====================

/** Get all jobs with filters */
export const getAllJobs = async (params = {}) => {
  const { data } = await api.get("/api/jobs/", { params });
  return data;
};

/** Get job by ID with full details */
export const getJobById = async (id) => {
  const { data } = await api.get(`/api/jobs/${id}/`);
  return data;
};

/** Update job */
export const updateJob = async (id, jobData) => {
  const { data } = await api.put(`/api/jobs/${id}/`, jobData);
  return data;
};

/** Partial update job */
export const updateJobPartial = async (id, jobData) => {
  const { data } = await api.patch(`/api/jobs/${id}/`, jobData);
  return data;
};

/** Delete job */
export const deleteJob = async (id) => {
  await api.delete(`/api/jobs/${id}/`);
  return { success: true };
};

// ==================== Job Applications Management ====================

/** Get all job applications with filters */
export const getAllApplications = async (params = {}) => {
  const { data } = await api.get("/api/job-applications/", { params });
  return data;
};

/** Get application by ID */
export const getApplicationById = async (id) => {
  const { data } = await api.get(`/api/job-applications/${id}/`);
  return data;
};

/** Update application status */
export const updateApplicationStatus = async (id, status) => {
  const { data } = await api.patch(`/api/job-applications/${id}/`, { status });
  return data;
};

/** Delete application */
export const deleteApplication = async (id) => {
  await api.delete(`/api/job-applications/${id}/`);
  return { success: true };
};

// ==================== Bookings Management ====================

/** Get all bookings */
export const getAllBookings = async (params = {}) => {
  const { data } = await api.get("/api/job-bookings/", { params });
  return data;
};

/** Get booking by ID */
export const getBookingById = async (id) => {
  const { data } = await api.get(`/api/job-bookings/${id}/`);
  return data;
};

// ==================== Chat Moderation ====================

/** Get all chats (admin can see all) */
export const getAllChats = async (params = {}) => {
  const { data } = await api.get("/api/chats/", { params });
  return data;
};

/** Get chat by ID with full message history */
export const getChatById = async (id) => {
  const { data } = await api.get(`/api/chats/${id}/`);
  return data;
};

/** Get all chats for specific employer */
export const getEmployerChats = async (employerId, params = {}) => {
  const { data } = await api.get(`/api/chats/employer/${employerId}/`, { params });
  return data;
};

/** Get all chats for specific cleaner */
export const getCleanerChats = async (cleanerId, params = {}) => {
  const { data } = await api.get(`/api/chats/cleaner/${cleanerId}/`, { params });
  return data;
};

/** Archive chat (moderation action) */
export const archiveChat = async (id, reason) => {
  const { data } = await api.patch(`/api/chats/${id}/`, {
    is_active: false,
    archived_reason: reason
  });
  return data;
};

/** Get all messages (admin view) */
export const getAllMessages = async (params = {}) => {
  const { data } = await api.get("/api/messages/", { params });
  return data;
};

/** Get messages for a specific chat */
export const getChatMessages = async (chatId) => {
  const { data } = await api.get(`/api/messages/chat/${chatId}/messages/`);
  return data;
};

/** Get flagged chats for moderation */
export const getFlaggedChats = async (params = {}) => {
  const { data } = await api.get("/api/flagged-chats/", { params });
  return data;
};

/** Update flagged chat status */
export const updateFlaggedChat = async (id, updateData) => {
  const { data } = await api.patch(`/api/flagged-chats/${id}/`, updateData);
  return data;
};

// ==================== User Management (Direct) ====================

/** Get all users */
export const getAllUsers = async (params = {}) => {
  const { data } = await api.get("/api/users/", { params });
  return data;
};

/** Get user by ID */
export const getUserById = async (id) => {
  const { data } = await api.get(`/api/users/${id}/`);
  return data;
};

/** Update user directly */
export const updateUser = async (id, userData) => {
  const { data } = await api.patch(`/api/users/${id}/`, userData);
  return data;
};

/** Activate user account */
export const activateUser = async (id) => {
  const { data } = await api.patch(`/api/users/${id}/`, { is_active: true });
  return data;
};

/** Deactivate user account */
export const deactivateUser = async (id) => {
  const { data } = await api.patch(`/api/users/${id}/`, { is_active: false });
  return data;
};

/** Delete user account */
export const deleteUser = async (id) => {
  await api.delete(`/api/users/${id}/`);
  return { success: true };
};

/** Change user role */
export const changeUserRole = async (userId, roleId) => {
  const { data } = await api.patch(`/api/users/${userId}/`, { role: roleId });
  return data;
};

// ==================== Roles Management ====================

/** Get all roles */
export const getAllRoles = async () => {
  const { data } = await api.get("/api/roles/");
  return data;
};

/** Get role by ID */
export const getRoleById = async (id) => {
  const { data } = await api.get(`/api/roles/${id}/`);
  return data;
};

/** Create new role */
export const createRole = async (roleData) => {
  const { data } = await api.post("/api/roles/", roleData);
  return data;
};

/** Update role */
export const updateRole = async (id, roleData) => {
  const { data } = await api.patch(`/api/roles/${id}/`, roleData);
  return data;
};

/** Delete role */
export const deleteRole = async (id) => {
  await api.delete(`/api/roles/${id}/`);
  return { success: true };
};

// ==================== Export Default Service Object ====================

const AdminService = {
  // Dashboard & Reports
  getDashboardStats,
  getUserReports,
  getJobsReports,
  getSecurityReports,
  
  // Cleaners
  getAllCleaners,
  getCleanerById,
  createCleaner,
  updateCleaner,
  updateCleanerFull,
  deleteCleaner,
  activateCleaner,
  deactivateCleaner,
  
  // Employers
  getAllEmployers,
  getEmployerById,
  createEmployer,
  updateEmployer,
  updateEmployerFull,
  deleteEmployer,
  activateEmployer,
  deactivateEmployer,
  
  // Services
  getAllServices,
  getServiceById,
  createService,
  updateService,
  updateServiceFull,
  deleteService,
  
  // Service Categories
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  
  // Jobs
  getAllJobs,
  getJobById,
  updateJob,
  updateJobPartial,
  deleteJob,
  
  // Job Applications
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  
  // Bookings
  getAllBookings,
  getBookingById,
  
  // Chat Moderation
  getAllChats,
  getChatById,
  getEmployerChats,
  getCleanerChats,
  archiveChat,
  getAllMessages,
  getChatMessages,
  getFlaggedChats,
  updateFlaggedChat,
  
  // User Management (Direct)
  getAllUsers,
  getUserById,
  updateUser,
  activateUser,
  deactivateUser,
  deleteUser,
  changeUserRole,
  
  // Roles Management
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};

export default AdminService;
