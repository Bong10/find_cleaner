"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getCleanerMe, patchCleanerMe } from "@/services/cleanerService";

const CVManager = () => {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadCV();
  }, []);

  const loadCV = async () => {
    try {
      setLoading(true);
      const response = await getCleanerMe();
      if (response.data?.cv) {
        const cvUrl = response.data.cv;
        // Convert relative URL to absolute if needed
        const absoluteUrl = cvUrl.startsWith('http') 
          ? cvUrl 
          : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${cvUrl.startsWith('/') ? cvUrl : '/' + cvUrl}`;
        
        setCvData({
          url: absoluteUrl,
          name: cvUrl.split('/').pop(),
          uploadedAt: response.data.updated_at || response.data.created_at,
        });
      } else {
        // No CV found, set to null
        setCvData(null);
      }
    } catch (error) {
      console.error("Error loading CV:", error);
      // Don't show error toast on initial load if CV doesn't exist
      if (cvData !== null) {
        toast.error("Failed to load CV");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF or Word document");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append("cv", file);

      console.log("📤 [CVManager] Uploading CV to backend:", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });

      await patchCleanerMe(formData);
      console.log("✅ [CVManager] CV uploaded successfully");
      toast.success("CV uploaded successfully");
      await loadCV();
    } catch (error) {
      console.error("Error uploading CV:", error);
      toast.error(error.response?.data?.cv?.[0] || "Failed to upload CV");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = () => {
    if (cvData?.url) {
      window.open(cvData.url, '_blank');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your CV?")) return;

    try {
      setUploading(true);
      
      // Send null to delete the CV
      const formData = new FormData();
      formData.append("cv", "");

      console.log("📤 [CVManager] Deleting CV from backend");

      await patchCleanerMe(formData);
      console.log("✅ [CVManager] CV deleted successfully");
      toast.success("CV deleted successfully");
      
      // Clear CV data immediately
      setCvData(null);
      
      // Reload to confirm deletion
      await loadCV();
    } catch (error) {
      console.error("Error deleting CV:", error);
      toast.error("Failed to delete CV");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="widget-content" style={{ textAlign: "center", padding: "60px 20px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ marginTop: "15px", color: "#696969" }}>Loading CV...</p>
      </div>
    );
  }

  return (
    <div className="widget-content">
      {cvData ? (
        // CV exists - show details with download/replace options
        <div>
          <div 
            style={{
              border: "2px dashed #e0e0e0",
              borderRadius: "8px",
              padding: "30px",
              textAlign: "center",
              backgroundColor: "#f9f9f9",
              marginBottom: "20px",
            }}
          >
            <div 
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#1967d2",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <svg 
                width="40" 
                height="40" 
                fill="white" 
                viewBox="0 0 24 24"
              >
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            
            <h5 style={{ marginBottom: "10px", color: "#202124" }}>
              {cvData.name}
            </h5>
            
            {cvData.uploadedAt && (
              <p style={{ color: "#696969", fontSize: "14px", marginBottom: "20px" }}>
                Uploaded on {new Date(cvData.uploadedAt).toLocaleDateString()}
              </p>
            )}

            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={handleDownload}
                className="theme-btn btn-style-one"
                style={{ 
                  padding: "10px 30px",
                  fontSize: "14px",
                }}
              >
                <i className="la la-download" style={{ marginRight: "8px" }}></i>
                Download CV
              </button>

              <label
                htmlFor="cv-replace-input"
                className="theme-btn btn-style-three"
                style={{ 
                  padding: "10px 30px",
                  fontSize: "14px",
                  cursor: uploading ? "not-allowed" : "pointer",
                  opacity: uploading ? 0.6 : 1,
                }}
              >
                <i className="la la-upload" style={{ marginRight: "8px" }}></i>
                {uploading ? "Uploading..." : "Replace CV"}
              </label>
              <input
                id="cv-replace-input"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                disabled={uploading}
                style={{ display: "none" }}
              />
            </div>
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
              <i className="la la-info-circle" style={{ color: "#1967d2", fontSize: "20px", marginTop: "2px" }}></i>
              <div>
                <p style={{ margin: 0, fontSize: "14px", color: "#202124" }}>
                  <strong>Your CV is visible to employers.</strong> Keep it updated to increase your chances of getting hired.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // No CV - show upload prompt
        <div>
          <div 
            style={{
              border: "2px dashed #d0d0d0",
              borderRadius: "8px",
              padding: "60px 20px",
              textAlign: "center",
              backgroundColor: "#fafafa",
              marginBottom: "20px",
            }}
          >
            <div 
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: "#f0f0f0",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <svg 
                width="50" 
                height="50" 
                fill="#b0b0b0" 
                viewBox="0 0 24 24"
              >
                <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
              </svg>
            </div>
            
            <h4 style={{ marginBottom: "15px", color: "#202124" }}>
              No CV Uploaded
            </h4>
            
            <p style={{ color: "#696969", marginBottom: "25px", fontSize: "15px" }}>
              Upload your CV to showcase your experience and qualifications to potential employers.
            </p>

            <label
              htmlFor="cv-upload-input"
              className="theme-btn btn-style-one"
              style={{ 
                padding: "12px 40px",
                fontSize: "15px",
                cursor: uploading ? "not-allowed" : "pointer",
                opacity: uploading ? 0.6 : 1,
              }}
            >
              <i className="la la-upload" style={{ marginRight: "8px" }}></i>
              {uploading ? "Uploading..." : "Upload CV"}
            </label>
            <input
              id="cv-upload-input"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              disabled={uploading}
              style={{ display: "none" }}
            />

            <p style={{ 
              marginTop: "20px", 
              fontSize: "13px", 
              color: "#999",
            }}>
              Accepted formats: PDF, DOC, DOCX (Max 5MB)
            </p>
          </div>

          <div 
            style={{
              backgroundColor: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: "6px",
              padding: "15px 20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "start", gap: "10px" }}>
              <i className="la la-exclamation-triangle" style={{ color: "#856404", fontSize: "20px", marginTop: "2px" }}></i>
              <div>
                <p style={{ margin: 0, fontSize: "14px", color: "#856404" }}>
                  <strong>Important:</strong> Your profile is incomplete without a CV. Employers may skip your application if no CV is available.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVManager;
