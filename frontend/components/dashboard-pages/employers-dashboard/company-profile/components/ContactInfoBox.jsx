"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchEmployerProfile,
  saveEmployerProfile,
  selectEmployerProfile,
} from "@/store/slices/employerProfileSlice";

// --- Cameroon phone helpers ---
const normalizePhoneCM = (raw) => {
  if (raw == null) return null;
  let s = String(raw).trim();
  if (!s) return null;

  // keep digits and plus
  s = s.replace(/[^\d+]/g, "");

  // 00XX -> +XX
  if (s.startsWith("00")) s = "+" + s.slice(2);

  // Already looks like +237XXXXXXXXX
  if (/^\+237\d{9}$/.test(s)) return s;

  // Handle cases like 237XXXXXXXXX -> +237XXXXXXXXX
  if (/^237\d{9}$/.test(s)) return "+" + s;

  // Local 9-digit (mobile starts with 6, landline starts with 2). Prefix +237
  const digits = s.replace(/\D/g, "");
  if (/^\d{9}$/.test(digits)) return "+237" + digits;

  // If user typed a full international +XXXXXXXXXXX (other country), accept
  if (/^\+\d{8,15}$/.test(s)) return s;

  // Not a recognized format
  return null;
};

const isValidPhoneCM = (value) => {
  if (value == null || String(value).trim() === "") return true; // allow empty (we'll send null)
  const norm = normalizePhoneCM(value);
  return norm !== null && /^\+237\d{9}$/.test(norm); // enforce CM E.164 strictly
};

export default function ContactInfoBox() {
  const dispatch = useDispatch();
  const profile = useSelector(selectEmployerProfile);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    gender: "",
    address: "",
    business_name: "",
  });

  // initial fetch (once)
  useEffect(() => {
    if (profile.status === "idle") {
      dispatch(fetchEmployerProfile())
        .unwrap()
        .catch((msg) => toast.error(String(msg)));
    }
  }, [dispatch, profile.status]);

  // sync form when store updates
  useEffect(() => {
    if (profile.status === "succeeded" || profile.status === "loading" || profile.status === "failed") {
      setForm((f) => ({
        ...f,
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        phone_number: profile.phone_number || "",
        gender: profile.gender || "",
        address: profile.address || "",
        business_name: profile.business_name || "",
      }));
    }
  }, [profile]);

  const onChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();

    // Validate phone before dispatch
    if (!isValidPhoneCM(form.phone_number)) {
      toast.error("Invalid phone number. Use format +237XXXXXXXXX (9 digits).");
      return;
    }

    const normalizedPhone = normalizePhoneCM(form.phone_number);
    const payload = {
      ...form,
      // empty -> null; otherwise normalized
      phone_number: normalizedPhone || null,
    };

    dispatch(saveEmployerProfile(payload))
      .unwrap()
      .then(() => {
        toast.success("Profile saved");
      })
      .catch((msg) => {
        toast.error(String(msg));
      });
  };

  const loading = profile.status === "loading";
  const saving = profile.saving;

  return (
    <form className="default-form" onSubmit={onSubmit}>
      <div className="row">
        {/* First Name */}
        <div className="form-group col-lg-6 col-md-12">
          <label>First name</label>
          <input
            type="text"
            name="first_name"
            placeholder="John"
            value={form.first_name}
            onChange={onChange("first_name")}
          />
        </div>

        {/* Last Name */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Last name</label>
          <input
            type="text"
            name="last_name"
            placeholder="Doe"
            value={form.last_name}
            onChange={onChange("last_name")}
          />
        </div>

        {/* Email (read-only from account) */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Email address</label>
          <input
            type="text"
            name="email"
            placeholder="email@company.com"
            value={form.email}
            disabled
            title="Email is managed from your account settings"
          />
        </div>

        {/* Phone */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Phone{" "}
            <span style={{ fontWeight: 400, color: "#888" }}>
              (e.g. +237650123456)
            </span>
          </label>
          <input
            type="text"
            name="phone_number"
            placeholder="+237650123456"
            value={form.phone_number}
            onChange={onChange("phone_number")}
          />
        </div>

        {/* Company / Business name */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Company / Business name</label>
          <input
            type="text"
            name="business_name"
            placeholder="Invisionn"
            value={form.business_name}
            onChange={onChange("business_name")}
          />
        </div>

        {/* Gender */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Gender</label>
          <select
            className="chosen-single form-select"
            value={form.gender || ""}
            onChange={onChange("gender")}
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Complete Address */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Complete Address</label>
          <input
            type="text"
            name="address"
            placeholder="329 Queensberry Street, North Melbourne VIC 3051, Australia."
            value={form.address}
            onChange={onChange("address")}
            required
          />
        </div>

        {/* Save */}
        <div className="form-group col-lg-12 col-md-12">
          <button type="submit" className="theme-btn btn-style-one" disabled={saving || loading}>
            {saving ? "Saving…" : loading ? "Loading…" : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
}
