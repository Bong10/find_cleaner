// @/utils/axiosConfig.js
import axios from "axios";

const RAW_BASE_URL =
  // process.env.NEXT_PUBLIC_API_BASE_URL || "http://217.154.36.63/";
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://cgsabiozard.co.uk";
export const BASE_URL = RAW_BASE_URL.replace(/\/+$/, ""); // strip trailing slash

let isRefreshing = false;
let failedQueue = [];

/** Resolve queued 401s after refresh */
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: BASE_URL,     // e.g. http://127.0.0.1:8000
  timeout: 15000,
  withCredentials: true, // send HttpOnly cookie on /auth/jwt/*
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/** REQUEST: attach access token from storage */
api.interceptors.request.use(
  (config) => {
    // Allow public endpoints to skip auth entirely
    const skipAuth = config?.skipAuth === true || (config?.headers && config.headers["X-Skip-Auth"]);
    if (skipAuth) {
      // Ensure cookies aren't sent for truly public calls (can be overridden per-call)
      config.withCredentials = false;
      return config;
    }
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** RESPONSE: auto-refresh once on 401 (except the refresh call itself) */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config || {};
    const status = error?.response?.status;
    const skipAuth = originalRequest?.skipAuth === true || (originalRequest?.headers && originalRequest.headers["X-Skip-Auth"]);

    // Never attempt refresh for login endpoints; allow error to propagate with backend detail
    const isLoginCall =
      typeof originalRequest.url === "string" &&
      (originalRequest.url.includes("/auth/jwt/create/") ||
       originalRequest.url.includes("/auth/jwt/admin/create/"));
    if (isLoginCall) {
      return Promise.reject(error);
    }

    // If we just logged out, do not try to refresh (prevents resurrection)
    if (typeof window !== "undefined") {
      const t = Number(localStorage.getItem("auth_logged_out_at") || 0);
      if (t && Date.now() - t < 5000) {
        return Promise.reject(error);
      }
    }

    const isRefreshCall =
      typeof originalRequest.url === "string" &&
      originalRequest.url.includes("/auth/jwt/refresh/");

    // CRITICAL: Handle missing profile/user errors
    // If the backend says "No Employer matches...", it means the user is logged in
    // but their profile data is missing/deleted. We must force logout to prevent
    // the dashboard from crashing or showing infinite errors.
    const detail = error?.response?.data?.errormessage || error?.response?.data?.detail;
    if (
      typeof detail === "string" &&
      (detail.includes("No Employer matches the given query") ||
       detail.includes("User not found"))
    ) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.setItem("auth_logged_out_at", String(Date.now()));
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry && !isRefreshCall && !skipAuth) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue while a refresh is in-flight
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newAccessToken) => {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // Cookie-only refresh
        const { data } = await api.post("/auth/jwt/refresh/", {});
        const newAccessToken = data?.access;

        if (!newAccessToken) {
          throw new Error("No access token returned by refresh");
        }

        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", newAccessToken);
        }

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("access_token");
            localStorage.setItem("auth_logged_out_at", String(Date.now()));
            // Signal the app to force-logout without a full reload
            localStorage.setItem("auth_force_logout", String(Date.now()));
            window.dispatchEvent(new Event("auth:force-logout"));
          } catch (_) {}
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
