// @/services/authService.js
import api from "@/utils/axiosConfig";

/**
 * Login: returns { access } and sets HttpOnly refresh cookie.
 * We store only the access token in localStorage.
 */
const login = async (email, password) => {
  const response = await api.post("/auth/jwt/create/", { email, password });
  const { access } = response.data || {};

  if (access && typeof window !== "undefined") {
    localStorage.setItem("access_token", access);
  }
  return response.data;
};

/**
 * Admin Login: uses dedicated admin endpoint that only accepts admin users.
 * Backend validates is_staff or role='Admin' before issuing token.
 */
const adminLogin = async (email, password) => {
  const response = await api.post("/auth/jwt/admin/create/", { email, password });
  const { access } = response.data || {};

  if (access && typeof window !== "undefined") {
    localStorage.setItem("access_token", access);
  }
  return response.data;
};

/** Register Cleaner with minimal payload (email + password only) */
export const registerCleaner = async ({ email, password }) => {
  const { data } = await api.post("/api/users/register/cleaner/", {
    user: { email, password },
  });
  return data; // message or created resource
};

/** Register Employer with minimal payload (email + password only) */
export const registerEmployer = async ({ email, password }) => {
  const { data } = await api.post("/api/users/register/employer/", {
    user: { email, password },
  });
  return data;
};

/** Fetch current user using access token */
const getCurrentUser = async () => {
  const response = await api.get("/auth/users/me/");
  return response.data;
};

/** Cookie-only refresh (no body needed). Stores new access on success. */
const refreshToken = async () => {
  const response = await api.post("/auth/jwt/refresh/", {});
  const { access } = response.data || {};
  if (access && typeof window !== "undefined") {
    localStorage.setItem("access_token", access);
  }
  return response.data;
};

/** Logout: server clears cookie; we clear local access in the caller thunk */
const logoutUser = async () => {
  try {
    await api.post("/auth/jwt/logout/");
  } catch (_) {
    // Ignore network/server errors for logout
  }
};

/**
 * Djoser: POST /auth/users/set_password/
 * If DJOSER["SET_PASSWORD_RETYPE"] = True,
 * body must include: current_password, new_password, re_new_password
 */
export async function changePassword(currentPassword, newPassword, confirmPassword) {
  const payload = {
    current_password: currentPassword,
    new_password: newPassword,
    re_new_password: confirmPassword,
  };
  const { data } = await api.post("/auth/users/set_password/", payload);
  return data || {};
}

// Add this to authService.js
export const activateAccount = async (uid, token) => {
  const { data } = await api.get(`/api/users/activate/${uid}/${token}/`);
  if (data.access && typeof window !== "undefined") {
    localStorage.setItem("access_token", data.access);
  }
  return data;
};

// Request password reset email (Djoser) — returns 204 No Content
export const requestPasswordReset = async (email) => {
  // Djoser expects { email }
  const res = await api.post("/auth/users/reset_password/", { email });
  return res?.data || {};
};

// Confirm new password (Djoser) — returns 204 No Content
export const confirmPasswordReset = async ({ uid, token, new_password, re_new_password }) => {
  const payload = { uid, token, new_password, re_new_password };
  const res = await api.post("/auth/users/reset_password_confirm/", payload);
  return res?.data || {};
};

const AuthService = {
  login,
  adminLogin,
  getCurrentUser,
  refreshToken,
  logoutUser,
  registerCleaner,
  registerEmployer,
  requestPasswordReset,
  confirmPasswordReset,
};

export default AuthService;


