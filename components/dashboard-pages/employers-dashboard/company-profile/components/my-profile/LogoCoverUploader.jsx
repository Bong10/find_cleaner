// components/.../my-profile/LogoCoverUploader.jsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  uploadEmployerLogo,
  uploadEmployerCover,
  selectEmployerProfile,
  fetchEmployerProfile,
} from "@/store/slices/employerProfileSlice";

const MAX_BYTES = 1 * 1024 * 1024;
const MIN_W = 330;
const MIN_H = 300;
const ALLOWED = ["image/jpeg", "image/png", "image/jpg"];

const validateImage = (file) =>
  new Promise((resolve, reject) => {
    if (!ALLOWED.includes(file.type)) return reject("Only JPG or PNG files are allowed");
    if (file.size > MAX_BYTES) return reject("Max file size is 1MB");
    const img = new Image();
    img.onload = () => {
      if (img.width < MIN_W || img.height < MIN_H) {
        reject(`Minimum dimension is ${MIN_W}x${MIN_H}px`);
      } else resolve();
    };
    img.onerror = () => reject("Invalid image");
    img.src = URL.createObjectURL(file);
  });

// Resolve relative /media/... paths
const API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL
    ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "")
    : "") || "";

const resolveMediaUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
};

export default function LogoCoverUploader() {
  const dispatch = useDispatch();
  const { uploadingLogo, uploadingCover, logo, cover_image, status, business_name, first_name, last_name } =
    useSelector(selectEmployerProfile);

  // Ensure profile is loaded on hard reload (if parent didn't prefetch)
  useEffect(() => {
    if (status === "idle") dispatch(fetchEmployerProfile());
  }, [status, dispatch]);

  const logoRef = useRef(null);
  const coverRef = useRef(null);

  // temp previews
  const [tempLogoUrl, setTempLogoUrl] = useState("");
  const [tempCoverUrl, setTempCoverUrl] = useState("");

  // Helper to get initials
  const getInitials = () => {
    if (business_name) {
      const parts = business_name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0]?.substring(0, 2).toUpperCase() || "CO";
    }
    if (first_name || last_name) {
      return ((first_name?.[0] || "") + (last_name?.[0] || "")).toUpperCase();
    }
    return "NA";
  };

  useEffect(() => {
    if (!uploadingLogo) setTempLogoUrl("");
  }, [uploadingLogo]);
  useEffect(() => {
    if (!uploadingCover) setTempCoverUrl("");
  }, [uploadingCover]);

  const onLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await validateImage(file);
      setTempLogoUrl(URL.createObjectURL(file));
      dispatch(uploadEmployerLogo(file)); // -> PATCH /auth/users/me/ with profile_picture
    } catch (err) {
      toast.error(String(err));
    } finally {
      e.target.value = "";
    }
  };

  const onCoverChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await validateImage(file);
      setTempCoverUrl(URL.createObjectURL(file));
      dispatch(uploadEmployerCover(file)); // -> PATCH /api/users/employers/me/ with cover_image
    } catch (err) {
      toast.error(String(err));
    } finally {
      e.target.value = "";
    }
  };

  // Final URLs (persist after reload thanks to fetchEmployerProfile)
  const logoUrl = tempLogoUrl || resolveMediaUrl(logo);            // <- user.profile_picture
  const coverUrl = tempCoverUrl || resolveMediaUrl(cover_image);   // <- employer.cover_image

  return (
    <>
      {/* Logo uploader (DESIGN UNCHANGED) */}
      <div className="uploading-outer">
        <div className="uploadButton">
          <input
            id="logo"
            className="uploadButton-input"
            type="file"
            name="logo"
            accept="image/*"
            ref={logoRef}
            onChange={onLogoChange}
            disabled={uploadingLogo}
          />
          <label className="uploadButton-button ripple-effect" htmlFor="logo">
            {uploadingLogo ? "Uploading..." : "Browse Logo"}
          </label>
          <div className="uploadButton-file-name">
            Max file size is 1MB, Minimum dimension: 330x300. JPG/PNG.
          </div>
        </div>

        {/* Small inline preview (keeps the same layout) */}
        <div style={{ marginTop: 8 }}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Company logo"
              style={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: 8,
                border: "1px solid #eee",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 8,
                border: "1px dashed #ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: "bold",
                color: "#fff",
                backgroundColor: "#1967d2", // Primary blue color
                textTransform: "uppercase",
              }}
            >
              {getInitials()}
            </div>
          )}
        </div>
      </div>

      {/* Cover uploader (DESIGN UNCHANGED) */}
      <div className="uploading-outer mt-4">
        <div className="uploadButton">
          <input
            id="cover_image"
            className="uploadButton-input"
            type="file"
            name="cover_image"
            accept="image/*"
            ref={coverRef}
            onChange={onCoverChange}
            disabled={uploadingCover}
          />
          <label className="uploadButton-button ripple-effect" htmlFor="cover_image">
            {uploadingCover ? "Uploading..." : "Browse Cover"}
          </label>
          <div className="uploadButton-file-name">
            Max file size is 1MB, Minimum dimension: 330x300. JPG/PNG.
          </div>
        </div>

        {/* Small inline preview */}
        <div style={{ marginTop: 8 }}>
          {coverUrl ? (
            <img
              src={coverUrl}
              alt="Company cover"
              style={{
                width: 160,
                height: 80,
                objectFit: "cover",
                borderRadius: 8,
                border: "1px solid #eee",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                width: 160,
                height: 80,
                borderRadius: 8,
                border: "1px dashed #ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                color: "#999",
              }}
            >
              No cover
            </div>
          )}
        </div>
      </div>
    </>
  );
}
