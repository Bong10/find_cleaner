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

const AuthService = {
  login,
  getCurrentUser,
  refreshToken,
  logoutUser,
  registerCleaner,
  registerEmployer,
};

export default AuthService;
