// utils/wsBase.js
import { BASE_URL } from "@/utils/axiosConfig";

const stripTrailingSlashes = (s) => String(s || "").replace(/\/+$/, "");

const toWsOrigin = (origin) => {
  const raw = stripTrailingSlashes(origin);
  if (!raw) return "";

  if (raw.startsWith("ws://") || raw.startsWith("wss://")) return raw;
  if (raw.startsWith("https://")) return `wss://${raw.slice("https://".length)}`;
  if (raw.startsWith("http://")) return `ws://${raw.slice("http://".length)}`;

  // If it's something like "127.0.0.1:8000"
  return `ws://${raw}`;
};

export const getWsBaseUrl = () => {
  const wsBase =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_WS_BASE_URL) ||
    BASE_URL;

  return toWsOrigin(wsBase);
};

export const buildWsUrl = (pathWithLeadingSlash) => {
  const base = getWsBaseUrl();
  const path = String(pathWithLeadingSlash || "");
  if (!base) return path;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
};
