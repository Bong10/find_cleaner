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
    date_of_birth: "",
    address_line1: "",
    address_line2: "",
    city: "",
    county: "",
    postcode: "",
    country: "United Kingdom",
    // cleaner
    portfolio: "",
    years_of_experience: "",
    dbs_check: false,
    dbs_certificate_number: "",
    availibility_status: "available", // maps to boolean when saving
    minimum_hours: 1,
    availability: {},
    service_types: [],
    service_areas: [],
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
          // Address & DOB are on the Cleaner model (data), not User model (u)
          date_of_birth: data?.date_of_birth || "",
          address_line1: data?.address_line1 || "",
          address_line2: data?.address_line2 || "",
          city: data?.city || "",
          county: data?.county || "",
          postcode: data?.postcode || "",
          country: data?.country || "United Kingdom",
          portfolio: data?.portfolio || "",
          years_of_experience: data?.years_of_experience ?? "",
          dbs_check: !!data?.dbs_check,
          dbs_certificate_number: data?.dbs_certificate_number || "",
          availibility_status:
            typeof data?.availibility_status === "boolean"
              ? (data.availibility_status ? "available" : "unavailable")
              : (data?.availibility_status || "available"),
          minimum_hours: data?.minimum_hours || 1,
          availability: data?.availability || {},
          // Handle both service_types (IDs) and services (Objects) to prevent overwriting with empty array
          service_types: Array.isArray(data?.service_types) && data.service_types.length > 0 
            ? data.service_types 
            : (Array.isArray(data?.services) ? data.services.map(s => s.id) : []),
          service_areas: data?.service_areas || [],
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
    };

    // 2) PATCH /api/users/cleaners/me/  (cleaner fields only)
    const cleanerPayload = {
      // Address & DOB belong to Cleaner model
      date_of_birth: form.date_of_birth || null,
      address_line1: form.address_line1 || "",
      address_line2: form.address_line2 || "",
      city: form.city || "",
      county: form.county || "",
      postcode: form.postcode || "",
      country: form.country || "United Kingdom",
      
      portfolio: form.portfolio || "",
      years_of_experience:
        form.years_of_experience === "" ? null : Number(form.years_of_experience),
      dbs_check:
        typeof form.dbs_check === "string"
          ? form.dbs_check === "true"
          : !!form.dbs_check,
      dbs_certificate_number: form.dbs_certificate_number || "",
      availibility_status: form.availibility_status === "available",
      minimum_hours: Number(form.minimum_hours) || 1,
      availability: form.availability || {},
      service_types: form.service_types || [],
      service_areas: form.service_areas || [],
    };

    try {
      console.log("📤 [FormInfoBox] Saving USER data to backend:", userPayload);
      if (typeof patchCurrentUser === "function") {
        await patchCurrentUser(userPayload);
        console.log("✅ [FormInfoBox] User data saved successfully");
      } else {
        throw new Error(
          "patchCurrentUser is not available from cleanerService. Export it or import from employerService."
        );
      }

      console.log("📤 [FormInfoBox] Saving CLEANER data to backend:", cleanerPayload);
      await patchCleanerMe(cleanerPayload);
      console.log("✅ [FormInfoBox] Cleaner data saved successfully");

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
        // Address & DOB from Cleaner model
        date_of_birth: data?.date_of_birth || "",
        address_line1: data?.address_line1 || "",
        address_line2: data?.address_line2 || "",
        city: data?.city || "",
        county: data?.county || "",
        postcode: data?.postcode || "",
        country: data?.country || "United Kingdom",
        portfolio: data?.portfolio || "",
        years_of_experience: data?.years_of_experience ?? "",
        dbs_check: !!data?.dbs_check,
        dbs_certificate_number: data?.dbs_certificate_number || "",
        availibility_status:
          typeof data?.availibility_status === "boolean"
            ? (data.availibility_status ? "available" : "unavailable")
            : (data?.availibility_status || "available"),
        minimum_hours: data?.minimum_hours || 1,
        availability: data?.availability || {},
        // Handle both service_types (IDs) and services (Objects)
        service_types: Array.isArray(data?.service_types) && data.service_types.length > 0 
          ? data.service_types 
          : (Array.isArray(data?.services) ? data.services.map(s => s.id) : []),
        service_areas: data?.service_areas || [],
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
              required
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
              required
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
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Date of Birth</label>
            <div className="date-input-wrapper">
              <input
                type="date"
                value={form.date_of_birth}
                onChange={onChange("date_of_birth")}
                max={new Date().toISOString().split('T')[0]}
                className="styled-date-input"
              />
              <span className="calendar-icon">
                <i className="la la-calendar"></i>
              </span>
            </div>
          </div>

          <style jsx>{`
            .date-input-wrapper {
              position: relative;
              display: flex;
              align-items: center;
            }
            .styled-date-input {
              width: 100%;
              padding: 15px 20px;
              border: 1px solid #ececec;
              border-radius: 8px;
              background-color: #f9f9f9;
              color: #696969;
              font-size: 15px;
              line-height: 26px;
              transition: all 0.3s ease;
              appearance: none;
              -webkit-appearance: none;
            }
            .styled-date-input:focus {
              border-color: #1967d2;
              background-color: #fff;
            }
            /* Hide the default calendar icon in some browsers to use our custom one if we wanted, 
               but usually keeping the native picker is better for functionality. 
               We just want it to look like a text field. */
            .styled-date-input::-webkit-calendar-picker-indicator {
              background: transparent;
              bottom: 0;
              color: transparent;
              cursor: pointer;
              height: auto;
              left: 0;
              position: absolute;
              right: 0;
              top: 0;
              width: auto;
            }
            .calendar-icon {
              position: absolute;
              right: 20px;
              pointer-events: none;
              color: #1967d2;
              font-size: 20px;
            }
          `}</style>

          {/* Address Line 1 */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Address Line 1 *</label>
            <input
              type="text"
              value={form.address_line1}
              onChange={onChange("address_line1")}
              placeholder="House number and street name"
              required
            />
          </div>

          {/* Address Line 2 */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Address Line 2</label>
            <input
              type="text"
              value={form.address_line2}
              onChange={onChange("address_line2")}
              placeholder="Apartment, suite, unit, etc. (optional)"
            />
          </div>

          {/* City */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Town/City *</label>
            <input
              type="text"
              value={form.city}
              onChange={onChange("city")}
              placeholder="e.g., London"
              required
            />
          </div>

          {/* County */}
          <div className="form-group col-lg-6 col-md-12">
            <label>County</label>
            <input
              type="text"
              value={form.county}
              onChange={onChange("county")}
              placeholder="e.g., Greater London"
            />
          </div>

          {/* Postcode */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Postcode *</label>
            <input
              type="text"
              value={form.postcode}
              onChange={(e) => setForm(s => ({ ...s, postcode: e.target.value.toUpperCase() }))}
              placeholder="e.g., SW1A 1AA"
              maxLength={8}
              required
            />
          </div>

          {/* Country */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Country</label>
            <input
              type="text"
              value={form.country}
              onChange={onChange("country")}
              placeholder="United Kingdom"
              readOnly
            />
          </div>

          {/* Portfolio / About You */}
          <div className="form-group col-lg-12 col-md-12">
            <label>About You / Portfolio</label>
            <textarea
              value={form.portfolio}
              onChange={onChange("portfolio")}
              placeholder="Tell clients about yourself, your experience, and what makes you great at cleaning..."
              rows={4}
              maxLength={500}
            />
            <small className="text-muted">{form.portfolio?.length || 0}/500 characters</small>
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

          {/* Minimum Booking Hours */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Minimum Booking Hours</label>
            <select
              className="chosen-single form-select"
              value={form.minimum_hours}
              onChange={onChange("minimum_hours")}
            >
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="3">3 hours</option>
              <option value="4">4 hours</option>
            </select>
          </div>

          {/* Availability Status - Calculated from availability field on backend */}

          {/* DBS Check - Removed from profile, managed in verification section */}

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
