// components/dashboard-pages/candidates-dashboard/my-profile/components/my-profile/FormInfoBox.jsx
"use client";

import { useEffect, useState } from "react";
import {
  getCleanerMe,
  patchCleanerMe,
  // If your cleanerService exports these (recommended):
  patchCurrentUser,
  // Otherwise you can import from employerService:
  // patchCurrentUser as patchCurrentUserFromEmployer
} from "@/services/cleanerService";

export default function FormInfoBox() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const [form, setForm] = useState({
    // user
    name: "",
    email: "",
    phone_number: "",
    gender: "",
    address: "",
    // cleaner
    portfolio: "",
    years_of_experience: "",
    dbs_check: false,
    insurance_details: "",
    availibility_status: "available", // maps to boolean when saving
    clean_level: 0,
  });

  // ---------- LOAD ----------
  useEffect(() => {
    (async () => {
      setError("");
      setOk("");
      setLoading(true);
      try {
        console.log("[FormInfoBox] GET /api/users/cleaners/me/");
        const { data } = await getCleanerMe();
        const u = data?.user || {};
        setForm({
          name: u.name || "",
          email: u.email || "",
          phone_number: u.phone_number || "",
          gender: u.gender || "",
          address: u.address || "",
          portfolio: data?.portfolio || "",
          years_of_experience: data?.years_of_experience ?? "",
          dbs_check: !!data?.dbs_check,
          insurance_details: data?.insurance_details || "",
          availibility_status:
            typeof data?.availibility_status === "boolean"
              ? (data.availibility_status ? "available" : "unavailable")
              : (data?.availibility_status || "available"),
          clean_level: Number(data?.clean_level ?? 0),
        });
      } catch (e) {
        console.log("[FormInfoBox] load error", e?.response?.data || e?.message);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChange = (key) => (e) => {
    const value =
      e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((s) => ({ ...s, [key]: value }));
  };

  // ---------- SAVE ----------
  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setOk("");

    // 1) PATCH /auth/users/me/  (user fields only)
    const userPayload = {
      // email stays read-only
      name: form.name || "",
      gender: form.gender || "",
      phone_number: form.phone_number || "",
      address: form.address || "",
    };

    // 2) PATCH /api/users/cleaners/me/  (cleaner fields only)
    const cleanerPayload = {
      portfolio: form.portfolio || "",
      years_of_experience:
        form.years_of_experience === "" ? null : Number(form.years_of_experience),
      dbs_check:
        typeof form.dbs_check === "string"
          ? form.dbs_check === "true"
          : !!form.dbs_check,
      insurance_details: form.insurance_details || "",
      availibility_status: form.availibility_status === "available",
      clean_level:
        form.clean_level === "" || form.clean_level === null
          ? 0
          : Number(form.clean_level),
    };

    try {
      console.log("[FormInfoBox] PATCH /auth/users/me/", userPayload);
      if (typeof patchCurrentUser === "function") {
        await patchCurrentUser(userPayload);
      } else {
        // If you didn't expose patchCurrentUser in cleanerService,
        // import it from employerService and call it here instead.
        throw new Error(
          "patchCurrentUser is not available from cleanerService. Export it or import from employerService."
        );
      }

      console.log("[FormInfoBox] PATCH /api/users/cleaners/me/", cleanerPayload);
      await patchCleanerMe(cleanerPayload);

      // Re-fetch canonical data (ensures UI reflects server)
      console.log("[FormInfoBox] Refresh GET /api/users/cleaners/me/");
      const { data } = await getCleanerMe();
      const u = data?.user || {};
      setForm((s) => ({
        ...s,
        name: u.name || "",
        email: u.email || s.email,
        phone_number: u.phone_number || "",
        gender: u.gender || "",
        address: u.address || "",
        portfolio: data?.portfolio || "",
        years_of_experience: data?.years_of_experience ?? "",
        dbs_check: !!data?.dbs_check,
        insurance_details: data?.insurance_details || "",
        availibility_status:
          typeof data?.availibility_status === "boolean"
            ? (data.availibility_status ? "available" : "unavailable")
            : (data?.availibility_status || "available"),
        clean_level: Number(data?.clean_level ?? 0),
      }));

      setOk("Profile updated.");
    } catch (e) {
      console.log("[FormInfoBox] save error", e?.response?.data || e?.message);
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="widget-content">
      <form className="default-form" onSubmit={save}>
        <div className="row">
          {/* Full Name */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={onChange("name")}
              placeholder="Enter your full name"
            />
          </div>

          {/* Email (read-only) */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Email Address</label>
            <input type="email" value={form.email} readOnly disabled placeholder="Email" />
          </div>

          {/* Phone */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Phone</label>
            <input
              type="text"
              value={form.phone_number}
              onChange={onChange("phone_number")}
              placeholder="0 123 456 7890"
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
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other / Prefer not to say</option>
            </select>
          </div>

          {/* Address */}
          <div className="form-group col-lg-12 col-md-12">
            <label>Complete Address</label>
            <input
              type="text"
              value={form.address}
              onChange={onChange("address")}
              placeholder="Enter your address"
            />
          </div>

          {/* Years of Experience */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Years of Experience</label>
            <input
              type="number"
              min="0"
              value={form.years_of_experience}
              onChange={onChange("years_of_experience")}
              placeholder="e.g. 3"
            />
          </div>

          {/* Clean Level */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Clean Level</label>
            <select
              className="chosen-single form-select"
              value={String(form.clean_level ?? 0)}
              onChange={(e) =>
                setForm((s) => ({ ...s, clean_level: Number(e.target.value) }))
              }
            >
              <option value="0">Level 0</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
              <option value="4">Level 4</option>
              <option value="5">Level 5</option>
            </select>
          </div>

          {/* Availability */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Availability Status</label>
            <select
              className="chosen-single form-select"
              value={form.availibility_status}
              onChange={onChange("availibility_status")}
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          {/* DBS Check */}
          <div className="form-group col-lg-6 col-md-12">
            <label>DBS Check</label>
            <select
              className="chosen-single form-select"
              value={String(!!form.dbs_check)}
              onChange={(e) =>
                setForm((s) => ({ ...s, dbs_check: e.target.value === "true" }))
              }
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          {/* Portfolio */}
          <div className="form-group col-lg-12 col-md-12">
            <label>Portfolio</label>
            <textarea
              value={form.portfolio}
              onChange={onChange("portfolio")}
              placeholder="Describe your work or paste a link"
            />
          </div>

          {/* Insurance Details */}
          <div className="form-group col-lg-12 col-md-12">
            <label>Insurance Details</label>
            <textarea
              value={form.insurance_details}
              onChange={onChange("insurance_details")}
              placeholder="Enter insurance details"
            />
          </div>

          <div className="form-group col-lg-12 col-md-12">
            <button className="theme-btn btn-style-one" type="submit" disabled={saving || loading}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {error ? <span style={{ marginLeft: 12, color: "#b91c1c" }}>{error}</span> : null}
            {ok ? <span style={{ marginLeft: 12, color: "#065f46" }}>{ok}</span> : null}
          </div>
        </div>
      </form>
    </div>
  );
}
