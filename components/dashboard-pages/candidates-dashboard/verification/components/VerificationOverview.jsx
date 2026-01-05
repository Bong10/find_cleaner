"use client";

import { useState, useEffect } from "react";
import { getCleanerMe, patchCleanerMe } from "@/services/cleanerService";
import { toast } from "react-toastify";
import { BASE_URL } from "@/utils/axiosConfig";

const VerificationOverview = () => {
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState({
    dbs_check: "pending",
    id_verified: "pending",
    references_verified: "pending",
  });
  const [cleanerData, setCleanerData] = useState(null);
  const [showResubmitModal, setShowResubmitModal] = useState(null);
  const [resubmitFiles, setResubmitFiles] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadVerificationStatus();
  }, []);

  const loadVerificationStatus = async () => {
    try {
      setLoading(true);
      const response = await getCleanerMe();
      const data = response.data;
      
      // Console log to see what backend returns
      console.log('=== VERIFICATION DATA FROM BACKEND ===');
      console.log('Full response:', data);
      console.log('dbs_verified:', data.dbs_verified, 'Type:', typeof data.dbs_verified);
      console.log('id_verified:', data.id_verified, 'Type:', typeof data.id_verified);
      console.log('references_verified:', data.references_verified, 'Type:', typeof data.references_verified);
      console.log('=====================================');
      
      setCleanerData(data);

      // Use backend values directly without conversion
      setVerification({
        dbs_check: data.dbs_verified,
        id_verified: data.id_verified,
        references_verified: data.references_verified,
      });
    } catch (error) {
      console.error("Error loading verification status:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "#2aa389";
      case "rejected": return "#dc3545";
      case "pending": return "#ffa500";
      default: return "#9aa0a6";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved": return "la-check-circle";
      case "rejected": return "la-times-circle";
      case "pending": return "la-clock";
      default: return "la-question-circle";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved": return "Verified";
      case "rejected": return "Rejected";
      case "pending": return "Pending";
      default: return "Unknown";
    }
  };

  const getDocumentUrl = (url) => {
    if (!url) return null;
    // If it's a relative URL, prepend the backend base URL
    if (url.startsWith('/media/')) {
      return `${BASE_URL}${url}`;
    }
    return url;
  };

  const handleResubmit = (itemId) => {
    setShowResubmitModal(itemId);
    setResubmitFiles({});
  };

  const handleFileChange = (fieldName, files) => {
    if (files && files.length > 0) {
      setResubmitFiles(prev => ({
        ...prev,
        [fieldName]: files[0]
      }));
    }
  };

  const handleSubmitResubmission = async () => {
    if (!showResubmitModal) return;
    
    // Validate required fields before submission
    if (showResubmitModal === "dbs") {
      if (!resubmitFiles.dbs_certificate_number || resubmitFiles.dbs_certificate_number.trim() === "") {
        toast.warning("Please enter your DBS certificate number");
        return;
      }
    } else if (showResubmitModal === "id") {
      if (!resubmitFiles.id_document_front) {
        toast.warning("Please upload the front of your ID document");
        return;
      }
      if (!resubmitFiles.id_document_back) {
        toast.warning("Please upload the back of your ID document");
        return;
      }
    } else if (showResubmitModal === "references") {
      // Validate professional reference
      if (!resubmitFiles.professional_ref_name || resubmitFiles.professional_ref_name.trim() === "") {
        toast.warning("Please enter professional reference name");
        return;
      }
      if (!resubmitFiles.professional_ref_relationship || resubmitFiles.professional_ref_relationship.trim() === "") {
        toast.warning("Please enter professional reference relationship");
        return;
      }
      if (!resubmitFiles.professional_ref_email || resubmitFiles.professional_ref_email.trim() === "") {
        toast.warning("Please enter professional reference email");
        return;
      }
      if (!resubmitFiles.professional_ref_phone || resubmitFiles.professional_ref_phone.trim() === "") {
        toast.warning("Please enter professional reference phone");
        return;
      }
      
      // Validate character reference
      if (!resubmitFiles.character_ref_name || resubmitFiles.character_ref_name.trim() === "") {
        toast.warning("Please enter character reference name");
        return;
      }
      if (!resubmitFiles.character_ref_relationship || resubmitFiles.character_ref_relationship.trim() === "") {
        toast.warning("Please enter character reference relationship");
        return;
      }
      if (!resubmitFiles.character_ref_email || resubmitFiles.character_ref_email.trim() === "") {
        toast.warning("Please enter character reference email");
        return;
      }
      if (!resubmitFiles.character_ref_phone || resubmitFiles.character_ref_phone.trim() === "") {
        toast.warning("Please enter character reference phone");
        return;
      }
    }
    
    setSubmitting(true);
    try {
      const formData = new FormData();
      
      // Add files based on verification type
      if (showResubmitModal === "dbs") {
        formData.append("dbs_certificate_number", resubmitFiles.dbs_certificate_number);
        // Reset status to pending when resubmitting
        formData.append("dbs_verified", "pending");
      } else if (showResubmitModal === "id") {
        formData.append("id_document_front", resubmitFiles.id_document_front);
        formData.append("id_document_back", resubmitFiles.id_document_back);
        // Reset status to pending when resubmitting
        formData.append("id_verified", "pending");
      } else if (showResubmitModal === "references") {
        // Add reference fields
        Object.keys(resubmitFiles).forEach(key => {
          if (key.startsWith("professional_ref_") || key.startsWith("character_ref_")) {
            formData.append(key, resubmitFiles[key]);
          }
        });
        // Reset status to pending when resubmitting
        formData.append("references_verified", "pending");
      }

      console.log("=== RESUBMISSION DATA BEING SENT ===");
      console.log("Verification type:", showResubmitModal);
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      console.log("====================================");
      
      // Make API call to update cleaner profile
      const response = await patchCleanerMe(formData);
      console.log("=== BACKEND RESPONSE AFTER RESUBMISSION ===");
      console.log("Response data:", response.data);
      console.log("references_verified status:", response.data.references_verified);
      console.log("===========================================");
      
      // Reload verification status to show updated data
      await loadVerificationStatus();
      
      // Close modal
      setShowResubmitModal(null);
      setResubmitFiles({});
      
      toast.success("Your documents have been resubmitted successfully! Status updated to pending.");
    } catch (error) {
      console.error("=== ERROR RESUBMITTING DOCUMENTS ===");
      console.error("Error object:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("====================================");
      
      const errorMessage = error.response?.data?.message || error.response?.data?.detail || "Failed to resubmit documents. Please try again.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowResubmitModal(null);
    setResubmitFiles({});
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }}>
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const allVerified = Object.values(verification).every(v => v === "approved");
  const verifiedCount = Object.values(verification).filter(v => v === "approved").length;
  const totalCount = Object.values(verification).length;
  const progressPercentage = (verifiedCount / totalCount) * 100;

  const verificationItems = [
    {
      id: "dbs",
      title: "DBS Check",
      status: verification.dbs_check,
      icon: "la-shield-alt",
      field: "dbs_check",
      description: cleanerData?.dbs_certificate_number 
        ? `Certificate: ${cleanerData.dbs_certificate_number}`
        : "Enhanced DBS check required",
      documentField: "dbs_certificate",
      resubmitRoute: "/candidates-dashboard/my-profile", // Route to resubmit
    },
    {
      id: "id",
      title: "ID Verification",
      status: verification.id_verified,
      icon: "la-id-card",
      field: "id_verified",
      description: cleanerData?.id_document_front && cleanerData?.id_document_back
        ? "Documents uploaded and verified"
        : "Upload your ID documents",
      documentField: "id_document",
      resubmitRoute: "/candidates-dashboard/my-profile",
    },
    {
      id: "references",
      title: "References",
      status: verification.references_verified,
      icon: "la-users",
      field: "references_verified",
      description: cleanerData?.professional_ref_name && cleanerData?.character_ref_name
        ? "References verified"
        : "Provide professional and character references",
      documentField: null,
      resubmitRoute: "/candidates-dashboard/my-profile",
    },
  ];

  return (
    <div className="widget-content">
      {/* Status Overview */}
      <div style={{
        background: "white",
        borderRadius: "8px",
        padding: "24px",
        marginBottom: "24px",
        border: "1px solid #e0e0e0",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <h4 style={{ margin: 0, fontSize: "20px", fontWeight: "600", color: "#202124" }}>
              Verification Status
            </h4>
            <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#5f6368" }}>
              {allVerified 
                ? "Your profile is fully verified"
                : `${verifiedCount} of ${totalCount} items verified`}
            </p>
          </div>
          {allVerified && (
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "#2aa389",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <i className="la la-check" style={{ fontSize: "24px", color: "white" }}></i>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div>
          <div style={{
            height: "8px",
            background: "#f0f0f0",
            borderRadius: "4px",
            overflow: "hidden",
          }}>
            <div style={{
              width: `${progressPercentage}%`,
              height: "100%",
              background: "#2aa389",
              borderRadius: "4px",
              transition: "width 0.3s ease",
            }}></div>
          </div>
        </div>
      </div>

      {/* Info Notice */}
      <div style={{
        background: "#f8f9fa",
        borderLeft: "4px solid #2aa389",
        padding: "16px 20px",
        marginBottom: "24px",
        borderRadius: "4px",
      }}>
        <p style={{ margin: 0, fontSize: "14px", color: "#5f6368", lineHeight: "1.6" }}>
          <strong style={{ color: "#202124" }}>Admin Review:</strong> All documents are reviewed within 24-48 hours. You'll be notified once verification is complete.
        </p>
      </div>

      {/* Verification Items */}
      <div style={{ marginBottom: "32px" }}>
        <h5 style={{ fontSize: "16px", fontWeight: "600", color: "#202124", marginBottom: "16px" }}>
          Verification Items
        </h5>
        <div style={{ display: "grid", gap: "16px" }}>
          {verificationItems.map((item) => (
            <div
              key={item.id}
              style={{
                background: "white",
                border: `2px solid ${item.status === "rejected" ? "#dc3545" : "#e0e0e0"}`,
                borderRadius: "8px",
                padding: "20px",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "8px",
                  background: getStatusColor(item.status),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <i className={`la ${item.icon}`} 
                     style={{ fontSize: "24px", color: "white" }}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h6 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#202124" }}>
                    {item.title}
                  </h6>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#5f6368" }}>
                    {item.description}
                  </p>
                </div>
                <div style={{
                  padding: "6px 12px",
                  borderRadius: "4px",
                  background: `${getStatusColor(item.status)}15`,
                  border: `1px solid ${getStatusColor(item.status)}40`,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}>
                  <i className={`la ${getStatusIcon(item.status)}`}
                     style={{ fontSize: "14px", color: getStatusColor(item.status) }}></i>
                  <span style={{ 
                    fontSize: "12px", 
                    fontWeight: "600",
                    color: getStatusColor(item.status),
                  }}>
                    {getStatusText(item.status)}
                  </span>
                </div>
              </div>

              {/* Rejected Alert with Resubmit Button */}
              {item.status === "rejected" && (
                <div style={{
                  marginTop: "16px",
                  padding: "12px 16px",
                  background: "#fff3cd",
                  border: "1px solid #ffc107",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "13px", color: "#856404", fontWeight: "600" }}>
                      <i className="la la-exclamation-triangle" style={{ marginRight: "6px" }}></i>
                      Verification Rejected
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#856404" }}>
                      Please review and resubmit your {item.title.toLowerCase()} information.
                    </p>
                  </div>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      handleResubmit(item.id);
                    }}
                    style={{
                      padding: "8px 16px",
                      background: "#2aa389",
                      color: "white",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#238c74";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#2aa389";
                    }}
                  >
                    Resubmit
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Documents & References */}
      {cleanerData && (cleanerData.id_document_front || cleanerData.professional_ref_name) && (
        <div>
          {/* Documents Section */}
          {(cleanerData.id_document_front || cleanerData.id_document_back) && (
            <div style={{ marginBottom: cleanerData.professional_ref_name || cleanerData.character_ref_name ? "32px" : "0" }}>
              <h5 style={{ fontSize: "16px", fontWeight: "600", color: "#202124", marginBottom: "16px" }}>
                Uploaded Documents
              </h5>
              <div style={{ display: "grid", gap: "12px" }}>
                {cleanerData.id_document_front && (
                  <a
                    href={getDocumentUrl(cleanerData.id_document_front)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "16px",
                      background: "white",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#2aa389";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(42, 163, 137, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e0e0e0";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <i className="la la-file-alt" style={{ fontSize: "24px", color: "#2aa389" }}></i>
                    <span style={{ flex: 1, fontSize: "14px", fontWeight: "500", color: "#202124" }}>
                      ID Document (Front)
                    </span>
                    <i className="la la-external-link-alt" style={{ fontSize: "16px", color: "#9aa0a6" }}></i>
                  </a>
                )}
                {cleanerData.id_document_back && (
                  <a
                    href={getDocumentUrl(cleanerData.id_document_back)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "16px",
                      background: "white",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#2aa389";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(42, 163, 137, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e0e0e0";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <i className="la la-file-alt" style={{ fontSize: "24px", color: "#2aa389" }}></i>
                    <span style={{ flex: 1, fontSize: "14px", fontWeight: "500", color: "#202124" }}>
                      ID Document (Back)
                    </span>
                    <i className="la la-external-link-alt" style={{ fontSize: "16px", color: "#9aa0a6" }}></i>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* References Section */}
          {(cleanerData.professional_ref_name || cleanerData.character_ref_name) && (
            <div>
              <h5 style={{ fontSize: "16px", fontWeight: "600", color: "#202124", marginBottom: "16px" }}>
                References
              </h5>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                {cleanerData.professional_ref_name && (
                  <div style={{
                    background: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "20px",
                  }}>
                    <div style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      background: "rgba(42, 163, 137, 0.1)",
                      borderRadius: "4px",
                      marginBottom: "12px",
                    }}>
                      <span style={{ fontSize: "11px", fontWeight: "600", color: "#2aa389", textTransform: "uppercase" }}>
                        Professional
                      </span>
                    </div>
                    <h6 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "12px", color: "#202124" }}>
                      {cleanerData.professional_ref_name}
                    </h6>
                    <div style={{ display: "grid", gap: "8px" }}>
                      {cleanerData.professional_ref_relationship && (
                        <div style={{ fontSize: "13px", color: "#5f6368" }}>
                          <i className="la la-briefcase" style={{ marginRight: "8px", color: "#9aa0a6" }}></i>
                          {cleanerData.professional_ref_relationship}
                        </div>
                      )}
                      {cleanerData.professional_ref_email && (
                        <div style={{ fontSize: "13px", color: "#5f6368", wordBreak: "break-all" }}>
                          <i className="la la-envelope" style={{ marginRight: "8px", color: "#9aa0a6" }}></i>
                          {cleanerData.professional_ref_email}
                        </div>
                      )}
                      {cleanerData.professional_ref_phone && (
                        <div style={{ fontSize: "13px", color: "#5f6368" }}>
                          <i className="la la-phone" style={{ marginRight: "8px", color: "#9aa0a6" }}></i>
                          {cleanerData.professional_ref_phone}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {cleanerData.character_ref_name && (
                  <div style={{
                    background: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "20px",
                  }}>
                    <div style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      background: "rgba(42, 163, 137, 0.1)",
                      borderRadius: "4px",
                      marginBottom: "12px",
                    }}>
                      <span style={{ fontSize: "11px", fontWeight: "600", color: "#2aa389", textTransform: "uppercase" }}>
                        Character
                      </span>
                    </div>
                    <h6 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "12px", color: "#202124" }}>
                      {cleanerData.character_ref_name}
                    </h6>
                    <div style={{ display: "grid", gap: "8px" }}>
                      {cleanerData.character_ref_relationship && (
                        <div style={{ fontSize: "13px", color: "#5f6368" }}>
                          <i className="la la-heart" style={{ marginRight: "8px", color: "#9aa0a6" }}></i>
                          {cleanerData.character_ref_relationship}
                        </div>
                      )}
                      {cleanerData.character_ref_email && (
                        <div style={{ fontSize: "13px", color: "#5f6368", wordBreak: "break-all" }}>
                          <i className="la la-envelope" style={{ marginRight: "8px", color: "#9aa0a6" }}></i>
                          {cleanerData.character_ref_email}
                        </div>
                      )}
                      {cleanerData.character_ref_phone && (
                        <div style={{ fontSize: "13px", color: "#5f6368" }}>
                          <i className="la la-phone" style={{ marginRight: "8px", color: "#9aa0a6" }}></i>
                          {cleanerData.character_ref_phone}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Resubmission Modal */}
      {showResubmitModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px",
        }}
        onClick={closeModal}
        >
          <div style={{
            background: "white",
            borderRadius: "12px",
            maxWidth: "600px",
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: "24px",
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <h4 style={{ margin: 0, fontSize: "20px", fontWeight: "600", color: "#202124" }}>
                Resubmit {showResubmitModal === "dbs" ? "DBS Check" : showResubmitModal === "id" ? "ID Verification" : "References"}
              </h4>
              <button
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  color: "#9aa0a6",
                  cursor: "pointer",
                  padding: "0",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                }}
              >
                <i className="la la-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px" }}>
              {/* DBS Check Fields */}
              {showResubmitModal === "dbs" && (
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#202124",
                    marginBottom: "8px",
                  }}>
                    DBS Certificate Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter certificate number"
                    onChange={(e) => setResubmitFiles(prev => ({ ...prev, dbs_certificate_number: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      transition: "all 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#2aa389";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#e0e0e0";
                    }}
                  />
                  <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "#5f6368" }}>
                    Enter your DBS certificate number for verification
                  </p>
                </div>
              )}

              {/* ID Verification Fields */}
              {showResubmitModal === "id" && (
                <div style={{ display: "grid", gap: "20px" }}>
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#202124",
                      marginBottom: "8px",
                    }}>
                      ID Document (Front)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("id_document_front", e.target.files)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#202124",
                      marginBottom: "8px",
                    }}>
                      ID Document (Back)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("id_document_back", e.target.files)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                    <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "#5f6368" }}>
                      Upload both sides of your ID document
                    </p>
                  </div>
                </div>
              )}

              {/* References Fields */}
              {showResubmitModal === "references" && (
                <div style={{ display: "grid", gap: "24px" }}>
                  {/* Professional Reference */}
                  <div style={{
                    padding: "20px",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                  }}>
                    <h6 style={{ margin: "0 0 16px 0", fontSize: "15px", fontWeight: "600", color: "#202124" }}>
                      Professional Reference
                    </h6>
                    <div style={{ display: "grid", gap: "16px" }}>
                      <div>
                        <label style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "#202124",
                          marginBottom: "6px",
                        }}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter name"
                          onChange={(e) => setResubmitFiles(prev => ({ ...prev, professional_ref_name: e.target.value }))}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            border: "1px solid #e0e0e0",
                            borderRadius: "6px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "#202124",
                          marginBottom: "6px",
                        }}>
                          Relationship
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Former Manager"
                          onChange={(e) => setResubmitFiles(prev => ({ ...prev, professional_ref_relationship: e.target.value }))}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            border: "1px solid #e0e0e0",
                            borderRadius: "6px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "#202124",
                          marginBottom: "6px",
                        }}>
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="email@example.com"
                          onChange={(e) => setResubmitFiles(prev => ({ ...prev, professional_ref_email: e.target.value }))}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            border: "1px solid #e0e0e0",
                            borderRadius: "6px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "#202124",
                          marginBottom: "6px",
                        }}>
                          Phone
                        </label>
                        <input
                          type="tel"
                          placeholder="+44 1234 567890"
                          onChange={(e) => setResubmitFiles(prev => ({ ...prev, professional_ref_phone: e.target.value }))}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            border: "1px solid #e0e0e0",
                            borderRadius: "6px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Character Reference */}
                  <div style={{
                    padding: "20px",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                  }}>
                    <h6 style={{ margin: "0 0 16px 0", fontSize: "15px", fontWeight: "600", color: "#202124" }}>
                      Character Reference
                    </h6>
                    <div style={{ display: "grid", gap: "16px" }}>
                      <div>
                        <label style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "#202124",
                          marginBottom: "6px",
                        }}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter name"
                          onChange={(e) => setResubmitFiles(prev => ({ ...prev, character_ref_name: e.target.value }))}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            border: "1px solid #e0e0e0",
                            borderRadius: "6px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "#202124",
                          marginBottom: "6px",
                        }}>
                          Relationship
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Friend, Colleague"
                          onChange={(e) => setResubmitFiles(prev => ({ ...prev, character_ref_relationship: e.target.value }))}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            border: "1px solid #e0e0e0",
                            borderRadius: "6px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "#202124",
                          marginBottom: "6px",
                        }}>
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="email@example.com"
                          onChange={(e) => setResubmitFiles(prev => ({ ...prev, character_ref_email: e.target.value }))}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            border: "1px solid #e0e0e0",
                            borderRadius: "6px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "#202124",
                          marginBottom: "6px",
                        }}>
                          Phone
                        </label>
                        <input
                          type="tel"
                          placeholder="+44 1234 567890"
                          onChange={(e) => setResubmitFiles(prev => ({ ...prev, character_ref_phone: e.target.value }))}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            border: "1px solid #e0e0e0",
                            borderRadius: "6px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: "20px 24px",
              borderTop: "1px solid #e0e0e0",
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
            }}>
              <button
                onClick={closeModal}
                style={{
                  padding: "10px 20px",
                  background: "white",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#5f6368",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f8f9fa";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitResubmission}
                disabled={submitting}
                style={{
                  padding: "10px 20px",
                  background: submitting ? "#9aa0a6" : "#2aa389",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "white",
                  cursor: submitting ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!submitting) e.currentTarget.style.background = "#238c74";
                }}
                onMouseLeave={(e) => {
                  if (!submitting) e.currentTarget.style.background = "#2aa389";
                }}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationOverview;
