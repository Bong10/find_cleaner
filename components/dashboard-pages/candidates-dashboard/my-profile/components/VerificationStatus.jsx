"use client";

import { useState, useEffect } from "react";
import { getCleanerMe } from "@/services/cleanerService";

const VerificationStatus = () => {
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState({
    dbs_check: false,
    id_verified: false,
    cv_uploaded: false,
    references_provided: false,
  });

  useEffect(() => {
    loadVerificationStatus();
  }, []);

  const loadVerificationStatus = async () => {
    try {
      setLoading(true);
      const response = await getCleanerMe();
      const data = response.data;

      setVerification({
        dbs_check: data.dbs_check || false,
        id_verified: !!(data.id_document_front && data.id_document_back),
        cv_uploaded: !!data.cv,
        references_provided: !!(data.professional_ref_name && data.character_ref_name),
      });
    } catch (error) {
      console.error("Error loading verification status:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    return status ? "#34a853" : "#fbbc04";
  };

  const getStatusText = (status) => {
    return status ? "Verified" : "Pending";
  };

  const getStatusIcon = (status) => {
    return status ? "la-check-circle" : "la-clock";
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "30px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const allVerified = Object.values(verification).every(v => v === true);

  return (
    <div className="widget-content">
      {allVerified ? (
        <div
          style={{
            backgroundColor: "#e8f5e9",
            border: "1px solid #34a853",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <i
            className="la la-check-circle"
            style={{ fontSize: "48px", color: "#34a853", marginBottom: "10px", display: "block" }}
          ></i>
          <h5 style={{ color: "#34a853", marginBottom: "5px" }}>Fully Verified</h5>
          <p style={{ margin: 0, color: "#5f6368", fontSize: "14px" }}>
            Your profile is fully verified and ready for job applications!
          </p>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#fff3cd",
            border: "1px solid #ffc107",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <i
            className="la la-exclamation-triangle"
            style={{ fontSize: "48px", color: "#ffc107", marginBottom: "10px", display: "block" }}
          ></i>
          <h5 style={{ color: "#856404", marginBottom: "5px" }}>Verification Pending</h5>
          <p style={{ margin: 0, color: "#856404", fontSize: "14px" }}>
            Some verification items are pending. Complete them to improve your chances of getting hired.
          </p>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "15px",
        }}
      >
        {/* DBS Check - Removed, managed in verification section */}

        {/* ID Verification */}
        <div
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: "#fafafa",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <i
              className={`la ${getStatusIcon(verification.id_verified)}`}
              style={{ fontSize: "24px", color: getStatusColor(verification.id_verified) }}
            ></i>
            <h6 style={{ margin: 0, color: "#202124" }}>ID Verification</h6>
          </div>
          <p style={{ margin: 0, fontSize: "13px", color: "#5f6368", marginBottom: "10px" }}>
            Identity document verification
          </p>
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "500",
              backgroundColor: verification.id_verified ? "#e8f5e9" : "#fff3cd",
              color: verification.id_verified ? "#34a853" : "#856404",
            }}
          >
            {getStatusText(verification.id_verified)}
          </span>
        </div>

        {/* CV */}
        <div
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: "#fafafa",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <i
              className={`la ${getStatusIcon(verification.cv_uploaded)}`}
              style={{ fontSize: "24px", color: getStatusColor(verification.cv_uploaded) }}
            ></i>
            <h6 style={{ margin: 0, color: "#202124" }}>CV Uploaded</h6>
          </div>
          <p style={{ margin: 0, fontSize: "13px", color: "#5f6368", marginBottom: "10px" }}>
            Resume/CV document
          </p>
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "500",
              backgroundColor: verification.cv_uploaded ? "#e8f5e9" : "#fff3cd",
              color: verification.cv_uploaded ? "#34a853" : "#856404",
            }}
          >
            {getStatusText(verification.cv_uploaded)}
          </span>
        </div>

        {/* References */}
        <div
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: "#fafafa",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <i
              className={`la ${getStatusIcon(verification.references_provided)}`}
              style={{ fontSize: "24px", color: getStatusColor(verification.references_provided) }}
            ></i>
            <h6 style={{ margin: 0, color: "#202124" }}>References</h6>
          </div>
          <p style={{ margin: 0, fontSize: "13px", color: "#5f6368", marginBottom: "10px" }}>
            Professional references provided
          </p>
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "500",
              backgroundColor: verification.references_provided ? "#e8f5e9" : "#fff3cd",
              color: verification.references_provided ? "#34a853" : "#856404",
            }}
          >
            {getStatusText(verification.references_provided)}
          </span>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#e8f0fe",
          border: "1px solid #1967d2",
          borderRadius: "6px",
          padding: "15px 20px",
          marginTop: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "start", gap: "10px" }}>
          <i
            className="la la-info-circle"
            style={{ color: "#1967d2", fontSize: "20px", marginTop: "2px" }}
          ></i>
          <div>
            <p style={{ margin: 0, fontSize: "14px", color: "#202124", lineHeight: "1.6" }}>
              <strong>Admin Verification:</strong> Verification status is managed by administrators. If you believe there's an error, please contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationStatus;
