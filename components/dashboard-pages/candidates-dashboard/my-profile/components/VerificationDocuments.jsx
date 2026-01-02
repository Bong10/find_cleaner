"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getCleanerMe, patchCleanerMe } from "@/services/cleanerService";

const VerificationDocuments = () => {
  const [documents, setDocuments] = useState({
    id_document_front: null,
    id_document_back: null,
    cv: null,
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({
    id_document_front: false,
    id_document_back: false,
    cv: false,
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await getCleanerMe();
      const data = response.data;

      setDocuments({
        id_document_front: data.id_document_front
          ? {
              url: data.id_document_front,
              name: data.id_document_front.split('/').pop(),
            }
          : null,
        id_document_back: data.id_document_back
          ? {
              url: data.id_document_back,
              name: data.id_document_back.split('/').pop(),
            }
          : null,
        cv: data.cv
          ? {
              url: data.cv,
              name: data.cv.split('/').pop(),
            }
          : null,
      });
    } catch (error) {
      console.error("Error loading documents:", error);
      toast.error("Failed to load verification documents");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (docType, file) => {
    if (!file) return;

    // Validate file type
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (docType === 'cv') {
      if (!allowedDocTypes.includes(file.type)) {
        toast.error("CV must be PDF or Word document");
        return;
      }
    } else {
      if (!allowedImageTypes.includes(file.type)) {
        toast.error("ID documents must be images (JPG, PNG, GIF)");
        return;
      }
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setUploading((prev) => ({ ...prev, [docType]: true }));

      const formData = new FormData();
      formData.append(docType, file);

      console.log(`📤 [VerificationDocuments] Uploading ${docType} to backend:`, {
        docType: docType,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });

      await patchCleanerMe(formData);
      console.log(`✅ [VerificationDocuments] ${docType} uploaded successfully`);
      toast.success(`${getDocumentLabel(docType)} uploaded successfully`);
      await loadDocuments();
    } catch (error) {
      console.error(`Error uploading ${docType}:`, error);
      toast.error(error.response?.data?.[docType]?.[0] || `Failed to upload ${getDocumentLabel(docType)}`);
    } finally {
      setUploading((prev) => ({ ...prev, [docType]: false }));
    }
  };

  const handleFileSelect = (docType) => (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(docType, file);
    }
  };

  const handleView = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const getDocumentLabel = (docType) => {
    switch (docType) {
      case 'id_document_front':
        return 'ID Document (Front)';
      case 'id_document_back':
        return 'ID Document (Back)';
      case 'cv':
        return 'CV';
      default:
        return docType;
    }
  };

  const getDocumentIcon = (docType) => {
    if (docType === 'cv') {
      return (
        <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      );
    }
    return (
      <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H13C12.59,21.75 12.2,21.44 11.86,21.1C11.53,20.77 11.25,20.4 11,20H6V4H13V9H18V10.18C18.71,10.34 19.39,10.61 20,11V8L14,2M20.31,18.9C21.64,16.79 21,14 18.91,12.68C16.8,11.35 14,12 12.69,14.08C11.35,16.19 12,18.97 14.09,20.3C15.55,21.23 17.41,21.23 18.88,20.32L22,23.39L23.39,22L20.31,18.9M16.5,19A2.5,2.5 0 0,1 14,16.5A2.5,2.5 0 0,1 16.5,14A2.5,2.5 0 0,1 19,16.5A2.5,2.5 0 0,1 16.5,19Z" />
      </svg>
    );
  };

  const renderDocumentCard = (docType) => {
    const doc = documents[docType];
    const isUploading = uploading[docType];
    const label = getDocumentLabel(docType);
    const acceptType = docType === 'cv' ? '.pdf,.doc,.docx' : 'image/*';

    return (
      <div
        key={docType}
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "20px",
          backgroundColor: doc ? "#f9f9f9" : "#fafafa",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "70px",
              height: "70px",
              backgroundColor: doc ? "#1967d2" : "#d0d0d0",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 15px",
            }}
          >
            {getDocumentIcon(docType)}
          </div>

          <h6 style={{ marginBottom: "8px", color: "#202124" }}>{label}</h6>

          {doc ? (
            <>
              <p
                style={{
                  fontSize: "13px",
                  color: "#696969",
                  marginBottom: "15px",
                  wordBreak: "break-all",
                }}
              >
                {doc.name}
              </p>

              <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={() => handleView(doc.url)}
                  className="theme-btn btn-style-three"
                  style={{
                    padding: "8px 20px",
                    fontSize: "13px",
                  }}
                >
                  <i className="la la-eye" style={{ marginRight: "5px" }}></i>
                  View
                </button>

                <label
                  htmlFor={`${docType}-input`}
                  className="theme-btn btn-style-one"
                  style={{
                    padding: "8px 20px",
                    fontSize: "13px",
                    cursor: isUploading ? "not-allowed" : "pointer",
                    opacity: isUploading ? 0.6 : 1,
                  }}
                >
                  <i className="la la-upload" style={{ marginRight: "5px" }}></i>
                  {isUploading ? "Uploading..." : "Replace"}
                </label>
                <input
                  id={`${docType}-input`}
                  type="file"
                  accept={acceptType}
                  onChange={handleFileSelect(docType)}
                  disabled={isUploading}
                  style={{ display: "none" }}
                />
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize: "13px", color: "#999", marginBottom: "15px" }}>
                Not uploaded yet
              </p>

              <label
                htmlFor={`${docType}-input`}
                className="theme-btn btn-style-one"
                style={{
                  padding: "8px 25px",
                  fontSize: "13px",
                  cursor: isUploading ? "not-allowed" : "pointer",
                  opacity: isUploading ? 0.6 : 1,
                }}
              >
                <i className="la la-upload" style={{ marginRight: "5px" }}></i>
                {isUploading ? "Uploading..." : "Upload"}
              </label>
              <input
                id={`${docType}-input`}
                type="file"
                accept={acceptType}
                onChange={handleFileSelect(docType)}
                disabled={isUploading}
                style={{ display: "none" }}
              />
            </>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ marginTop: "15px", color: "#696969" }}>Loading documents...</p>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {renderDocumentCard('id_document_front')}
        {renderDocumentCard('id_document_back')}
        {renderDocumentCard('cv')}
      </div>

      <div
        style={{
          backgroundColor: "#e8f0fe",
          border: "1px solid #1967d2",
          borderRadius: "6px",
          padding: "15px 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "start", gap: "10px" }}>
          <i
            className="la la-info-circle"
            style={{ color: "#1967d2", fontSize: "20px", marginTop: "2px" }}
          ></i>
          <div>
            <p style={{ margin: 0, fontSize: "14px", color: "#202124", lineHeight: "1.6" }}>
              <strong>Verification Required:</strong> Please upload clear, legible copies of your ID documents (front and back) and your CV. These documents help verify your identity and qualifications.
            </p>
            <ul style={{ marginTop: "10px", marginBottom: 0, paddingLeft: "20px", fontSize: "13px", color: "#5f6368" }}>
              <li>ID Documents: JPG, PNG, or GIF (Max 5MB each)</li>
              <li>CV: PDF, DOC, or DOCX (Max 5MB)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationDocuments;
