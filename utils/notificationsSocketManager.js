// utils/notificationsSocketManager.js
// Singleton WebSocket manager for notifications - ensures only ONE connection per session

import { buildWsUrl } from "@/utils/wsBase";

const safeJsonParse = (raw) => {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

class NotificationsSocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectTimer = null;
    this.retries = 0;
    this.listeners = new Set();
    this.closing = false;
    this.connecting = false;
  }

  addListener(callback) {
    // Prevent duplicate listeners
    if (this.listeners.has(callback)) {
      return () => this.removeListener(callback);
    }
    
    this.listeners.add(callback);
    console.log(`[NotificationsSocket] Listener added. Total: ${this.listeners.size}`);
    
    // Auto-connect when first listener subscribes
    if (this.listeners.size === 1 && !this.isConnected && !this.connecting) {
      this.connect();
    }
    return () => this.removeListener(callback);
  }

  removeListener(callback) {
    this.listeners.delete(callback);
    console.log(`[NotificationsSocket] Listener removed. Total: ${this.listeners.size}`);
    
    // Auto-disconnect when no listeners remain
    if (this.listeners.size === 0) {
      this.close();
    }
  }

  notifyListeners(event) {
    this.listeners.forEach((cb) => {
      try {
        cb(event);
      } catch (e) {
        console.error("[NotificationsSocket] Listener error:", e);
      }
    });
  }

  connect() {
    if (typeof window === "undefined") return;
    
    // Prevent multiple simultaneous connection attempts
    if (this.connecting) {
      console.log("[NotificationsSocket] Already connecting, skipping...");
      return;
    }
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log("[NotificationsSocket] Already connected, skipping...");
      return;
    }
    if (this.socket && this.socket.readyState === WebSocket.CONNECTING) {
      console.log("[NotificationsSocket] Connection in progress, skipping...");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      console.warn("[NotificationsSocket] No auth token, skipping connection");
      return;
    }

    this.closing = false;
    this.connecting = true;

    const url = buildWsUrl(`/ws/notifications/?token=${encodeURIComponent(token)}`);
    console.log("[NotificationsSocket] Connecting...");
    
    const socket = new WebSocket(url);
    this.socket = socket;

    socket.onopen = () => {
      console.log("[NotificationsSocket] Connected");
      this.retries = 0;
      this.isConnected = true;
      this.connecting = false;
    };

    socket.onmessage = (event) => {
      const data = safeJsonParse(event.data);
      if (!data) return;
      this.notifyListeners(data);
    };

    socket.onerror = (e) => {
      console.error("[NotificationsSocket] Error:", e);
      this.connecting = false;
    };

    socket.onclose = () => {
      console.log("[NotificationsSocket] Closed");
      this.isConnected = false;
      this.connecting = false;
      this.socket = null;

      if (this.closing) return;
      if (this.listeners.size === 0) return;

      // Reconnect with backoff
      const delay = Math.min(30000, 1000 * Math.pow(2, this.retries));
      this.retries += 1;
      console.log(`[NotificationsSocket] Reconnecting in ${delay}ms...`);
      this.reconnectTimer = setTimeout(() => this.connect(), delay);
    };
  }

  close() {
    console.log("[NotificationsSocket] Closing...");
    this.closing = true;
    this.isConnected = false;
    this.connecting = false;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      try {
        this.socket.close(1000, "Client closing");
      } catch {}
      this.socket = null;
    }
  }

  // Force reconnect (e.g., after login/token refresh)
  reconnect() {
    this.close();
    this.closing = false;
    if (this.listeners.size > 0) {
      this.connect();
    }
  }
}

// Singleton instance
export const notificationsSocketManager = new NotificationsSocketManager();
