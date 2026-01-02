"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getCleanerMe, patchCleanerMe } from "@/services/cleanerService";

const ReferencesManager = () => {
  const [references, setReferences] = useState({
    professional_ref_name: "",
    professional_ref_email: "",
    professional_ref_phone: "",
    professional_ref_relationship: "",
    character_ref_name: "",
    character_ref_email: "",
    character_ref_phone: "",
    character_ref_relationship: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadReferences();
  }, []);

  const loadReferences = async () => {
    try {
      setLoading(true);
      const response = await getCleanerMe();
      const data = response.data;

      setReferences({
        professional_ref_name: data.professional_ref_name || "",
        professional_ref_email: data.professional_ref_email || "",
        professional_ref_phone: data.professional_ref_phone || "",
        professional_ref_relationship: data.professional_ref_relationship || "",
        character_ref_name: data.character_ref_name || "",
        character_ref_email: data.character_ref_email || "",
        character_ref_phone: data.character_ref_phone || "",
        character_ref_relationship: data.character_ref_relationship || "",
      });
    } catch (error) {
      console.error("Error loading references:", error);
      toast.error("Failed to load references");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setReferences((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    return phone.length >= 10 && phoneRegex.test(phone);
  };

  const handleSave = async () => {
    // Validate professional reference
    if (references.professional_ref_name || references.professional_ref_email || references.professional_ref_phone) {
      if (!references.professional_ref_name) {
        toast.error("Professional reference name is required");
        return;
      }
      if (!references.professional_ref_email || !validateEmail(references.professional_ref_email)) {
        toast.error("Valid professional reference email is required");
        return;
      }
      if (!references.professional_ref_phone || !validatePhone(references.professional_ref_phone)) {
        toast.error("Valid professional reference phone is required (min 10 digits)");
        return;
      }
      if (!references.professional_ref_relationship) {
        toast.error("Professional reference relationship is required");
        return;
      }
    }

    // Validate character reference
    if (references.character_ref_name || references.character_ref_email || references.character_ref_phone) {
      if (!references.character_ref_name) {
        toast.error("Character reference name is required");
        return;
      }
      if (!references.character_ref_email || !validateEmail(references.character_ref_email)) {
        toast.error("Valid character reference email is required");
        return;
      }
      if (!references.character_ref_phone || !validatePhone(references.character_ref_phone)) {
        toast.error("Valid character reference phone is required (min 10 digits)");
        return;
      }
      if (!references.character_ref_relationship) {
        toast.error("Character reference relationship is required");
        return;
      }
    }

    try {
      setSaving(true);
      console.log("📤 [ReferencesManager] Saving references to backend:", references);
      await patchCleanerMe(references);
      console.log("✅ [ReferencesManager] References saved successfully");
      toast.success("References updated successfully");
      setEditing(false);
      await loadReferences();
    } catch (error) {
      console.error("Error saving references:", error);
      const errorMessage = error.response?.data;
      if (errorMessage && typeof errorMessage === 'object') {
        const firstError = Object.values(errorMessage)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : "Failed to save references");
      } else {
        toast.error("Failed to save references");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    loadReferences();
    setEditing(false);
  };

  const hasReferences = () => {
    return references.professional_ref_name || references.character_ref_name;
  };

  const renderReferenceCard = (type, title) => {
    const prefix = type === 'professional' ? 'professional_ref' : 'character_ref';
    const name = references[`${prefix}_name`];
    const email = references[`${prefix}_email`];
    const phone = references[`${prefix}_phone`];
    const relationship = references[`${prefix}_relationship`];

    return (
      <div
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "25px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: type === 'professional' ? "#1967d2" : "#34a853",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i className="la la-user" style={{ fontSize: "24px", color: "white" }}></i>
          </div>
          <div>
            <h5 style={{ margin: 0, color: "#202124" }}>{title}</h5>
            <p style={{ margin: 0, fontSize: "13px", color: "#696969" }}>
              {relationship || "No relationship specified"}
            </p>
          </div>
        </div>

        {editing ? (
          <div className="form-group">
            <label style={{ fontSize: "14px", fontWeight: "500", marginBottom: "5px", display: "block" }}>
              Full Name *
            </label>
            <input
              type="text"
              name={`${prefix}_name`}
              value={name}
              onChange={handleChange(`${prefix}_name`)}
              placeholder="Enter full name"
              style={{ marginBottom: "15px" }}
            />

            <label style={{ fontSize: "14px", fontWeight: "500", marginBottom: "5px", display: "block" }}>
              Email *
            </label>
            <input
              type="email"
              name={`${prefix}_email`}
              value={email}
              onChange={handleChange(`${prefix}_email`)}
              placeholder="reference@example.com"
              style={{ marginBottom: "15px" }}
            />

            <label style={{ fontSize: "14px", fontWeight: "500", marginBottom: "5px", display: "block" }}>
              Phone *
            </label>
            <input
              type="tel"
              name={`${prefix}_phone`}
              value={phone}
              onChange={handleChange(`${prefix}_phone`)}
              placeholder="+44 1234 567890"
              style={{ marginBottom: "15px" }}
            />

            <label style={{ fontSize: "14px", fontWeight: "500", marginBottom: "5px", display: "block" }}>
              Relationship *
            </label>
            <input
              type="text"
              name={`${prefix}_relationship`}
              value={relationship}
              onChange={handleChange(`${prefix}_relationship`)}
              placeholder="e.g., Former Manager, Colleague, Friend"
            />
          </div>
        ) : (
          <div>
            {name ? (
              <>
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "12px", color: "#696969", marginBottom: "3px" }}>Name</div>
                  <div style={{ fontSize: "15px", color: "#202124", fontWeight: "500" }}>{name}</div>
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "12px", color: "#696969", marginBottom: "3px" }}>Email</div>
                  <div style={{ fontSize: "15px", color: "#202124" }}>
                    <a href={`mailto:${email}`} style={{ color: "#1967d2" }}>{email}</a>
                  </div>
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "12px", color: "#696969", marginBottom: "3px" }}>Phone</div>
                  <div style={{ fontSize: "15px", color: "#202124" }}>
                    <a href={`tel:${phone}`} style={{ color: "#1967d2" }}>{phone}</a>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#999" }}>
                <i className="la la-user-slash" style={{ fontSize: "40px", marginBottom: "10px", display: "block" }}></i>
                <p style={{ margin: 0, fontSize: "14px" }}>No {type} reference added</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ marginTop: "15px", color: "#696969" }}>Loading references...</p>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {renderReferenceCard('professional', 'Professional Reference')}
        {renderReferenceCard('character', 'Character Reference')}
      </div>

      {editing ? (
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button
            onClick={handleCancel}
            className="theme-btn btn-style-three"
            disabled={saving}
            style={{ padding: "10px 30px" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="theme-btn btn-style-one"
            disabled={saving}
            style={{ padding: "10px 30px" }}
          >
            {saving ? "Saving..." : "Save References"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => setEditing(true)}
            className="theme-btn btn-style-one"
            style={{ padding: "10px 30px" }}
          >
            <i className="la la-pencil" style={{ marginRight: "8px" }}></i>
            {hasReferences() ? "Edit References" : "Add References"}
          </button>
        </div>
      )}

      <div
        style={{
          backgroundColor: "#fff3cd",
          border: "1px solid #ffc107",
          borderRadius: "6px",
          padding: "15px 20px",
          marginTop: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "start", gap: "10px" }}>
          <i
            className="la la-lightbulb"
            style={{ color: "#856404", fontSize: "20px", marginTop: "2px" }}
          ></i>
          <div>
            <p style={{ margin: 0, fontSize: "14px", color: "#856404", lineHeight: "1.6" }}>
              <strong>References are important!</strong> Providing professional and character references increases your credibility and chances of being hired. Ensure your references are aware they may be contacted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferencesManager;
