// components/dashboard-pages/candidates-dashboard/my-profile/components/my-profile/LogoUpload.jsx
"use client";

import { useEffect, useId, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCleanerProfile,
  setAvatarFile,
  uploadAvatar,
  deleteAvatar,
  loadCompleteCleanerProfile,
} from "@/store/slices/cleanerProfileSlice";
import InitialsAvatar from "../../../../../common/InitialsAvatar";
import { toast } from "react-toastify";

export default function LogoUpload() {
  const dispatch = useDispatch();
  const inputId = useId();

  const { user, avatarFile, avatarUploading, status } =
    useSelector(selectCleanerProfile) || {};

  // 👉 ensure state is hydrated after a full page reload
  useEffect(() => {
    if (status === "idle") {
      console.debug("[LogoUpload] boot → loadCompleteCleanerProfile()");
      dispatch(loadCompleteCleanerProfile());
    }
  }, [status, dispatch]);

// Prefer local preview if user just picked a file; otherwise absolute server URL.
const preview = useMemo(() => {
  if (avatarFile) return URL.createObjectURL(avatarFile);

  const raw = user?.profile_picture || "";
  if (!raw) return "";

  // If backend returned absolute, use it as-is.
  if (/^https?:\/\//i.test(raw)) return raw;

  // Otherwise, prepend API origin (set in your .env)
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  console.log(base+'test console'+process.env.NEXT_PUBLIC_API_BASE_URL);
  const url = `${base}${path}`;
  console.debug("[LogoUpload] absolutized picture:", url);
  return url;
}, [avatarFile, user?.profile_picture]);

  // Revoke blob URLs to avoid leaks
  useEffect(() => {
    return () => {
      if (avatarFile && preview?.startsWith("blob:")) {
        try { URL.revokeObjectURL(preview); } catch {}
      }
    };
  }, [avatarFile, preview]);

  const onPick = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.debug("[LogoUpload] picked:", file.name, file.type, file.size);
      // Basic 1MB check to match your hint text (optional)
      if (file.size > 1024 * 1024) {
        toast.warning("Max file size is 1MB.");
        return;
      }
      dispatch(setAvatarFile(file));
    }
  };

  const onSave = () => {
    console.debug("[LogoUpload] save avatar");
    dispatch(uploadAvatar());
  };

  const onDelete = () => {
    console.debug("[LogoUpload] delete avatar");
    dispatch(deleteAvatar());
  };

  return (
    <div className="ls-widget">
      <div className="widget-title"><h4>Profile Photo</h4></div>
      <div className="widget-content">
        <div className="uploading-outer">
          <div className="uploadButton">
            <input
              id={inputId}
              className="uploadButton-input"
              type="file"
              accept="image/*"
              onChange={onPick}
              disabled={avatarUploading}
            />
            <label className="uploadButton-button ripple-effect" htmlFor={inputId}>
              {avatarFile ? "Change Photo" : "Upload Photo"}
            </label>
            <span className="uploadButton-file-name">
              Max file size is 1MB, Minimum dimension: 330x300 And Suitable files are .jpg & .png
            </span>
          </div>

          {preview || user?.name ? (
            <div className="logo-preview" style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <InitialsAvatar
                name={user?.name || user?.first_name || user?.email?.split('@')[0] || "User"}
                src={preview}
                size={60}
                style={{ borderRadius: 8 }}
              />

              {/* ✅ save (green) */}
              <button
                type="button"
                onClick={onSave}
                disabled={avatarUploading || !avatarFile}
                title="Save photo"
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: avatarUploading || !avatarFile ? "not-allowed" : "pointer",
                }}
              >
                <i className="la la-check-circle" style={{ color: "#16a34a", fontSize: 20 }} />
              </button>

              {/* ❌ delete (red) */}
              <button
                type="button"
                onClick={onDelete}
                disabled={avatarUploading || (!user?.profile_picture && !avatarFile)}
                title="Remove photo"
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor:
                    avatarUploading || (!user?.profile_picture && !avatarFile)
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                <i className="la la-times-circle" style={{ color: "#dc2626", fontSize: 20 }} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
