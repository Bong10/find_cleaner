// components/onboarding/steps/CleanerStep3.jsx
"use client";
import { useState } from 'react';

const CleanerStep3 = ({ formData, onUpdate }) => {
  const [previews, setPreviews] = useState({ id: null, certs: [] });

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (type === 'id_document') {
      const file = files[0];
      onUpdate('id_document', file); // Store the file object
      const reader = new FileReader();
      reader.onloadend = () => setPreviews(prev => ({ ...prev, id: reader.result }));
      reader.readAsDataURL(file);
    } else if (type === 'certifications') {
      // Add new files to the existing array in formData
      const existingFiles = formData.certifications || [];
      onUpdate('certifications', [...existingFiles, ...files]);
      
      // Generate previews for the new files
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => ({ ...prev, certs: [...prev.certs, reader.result] }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Verification & Trust</h2>
        <p>Build trust with clients through verification</p>
      </div>
      <div className="form-content">
        <div className="verification-section">
          <div className="section-icon">🆔</div>
          <h3>Identity Verification</h3>
          <p className="section-description">Upload a government-issued ID to verify your identity.</p>
          <div className="upload-area">
            <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'id_document')} id="id-upload" className="file-input"/>
            <label htmlFor="id-upload" className="upload-label">
              {previews.id ? (
                <div className="preview-container">
                  <img src={previews.id} alt="ID Preview" className="doc-preview" />
                  <span className="change-text">Click to change</span>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  <span className="upload-text">Upload ID Document</span>
                  <span className="upload-hint">JPG, PNG or PDF (max 5MB)</span>
                </div>
              )}
            </label>
          </div>
        </div>
        <div className="verification-section">
          <div className="section-icon">✅</div>
          <h3>Background Check (DBS)</h3>
          <p className="section-description">Having a DBS check significantly increases your chances of getting hired.</p>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={formData.dbs_check || false} onChange={(e) => onUpdate('dbs_check', e.target.checked)} className="checkbox-input"/>
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">I have a valid DBS certificate</span>
            </label>
          </div>
          {formData.dbs_check && (
            <div className="dbs-details">
              <input type="text" value={formData.dbs_certificate_number || ''} onChange={(e) => onUpdate('dbs_certificate_number', e.target.value)} className="form-input" placeholder="DBS Certificate Number (optional)"/>
            </div>
          )}
        </div>
        <div className="verification-section">
          <div className="section-icon">🛡️</div>
          <h3>Insurance Details</h3>
          <p className="section-description">Having liability insurance protects both you and your clients.</p>
          <textarea value={formData.insurance_details || ''} onChange={(e) => onUpdate('insurance_details', e.target.value)} className="form-textarea" placeholder="Enter your insurance provider and policy details (optional)" rows={3}/>
        </div>
        <div className="verification-section">
          <div className="section-icon">🏆</div>
          <h3>Professional Certifications</h3>
          <p className="section-description">Add any cleaning certifications or training you've completed.</p>
          <div className="upload-area">
            <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'certifications')} id="cert-upload" className="file-input" multiple/>
            <label htmlFor="cert-upload" className="upload-label secondary">
              {previews.certs.length > 0 ? (
                <div className="preview-grid">
                  {previews.certs.map((src, i) => <img key={i} src={src} alt={`Cert preview ${i+1}`} />)}
                </div>
              ) : (
                <div className="upload-placeholder">
                  <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <span className="upload-text">Upload Certificates</span>
                  <span className="upload-hint">You can select multiple files</span>
                </div>
              )}
            </label>
          </div>
        </div>
        <div className="trust-badge">{/* ... badge JSX ... */}</div>
      </div>
      <style jsx>{`
        .step-container{background:white;border-radius:16px;padding:40px;box-shadow:0 4px 20px rgba(0,0,0,.08)}.step-header{margin-bottom:40px}.step-header h2{font-size:32px;font-weight:700;color:#1a1a1a;margin-bottom:8px}.step-header p{font-size:16px;color:#6b7280}.form-content{display:flex;flex-direction:column;gap:32px}.verification-section{padding:24px;border:1px solid #e5e7eb;border-radius:12px;background:#fafafa}.section-icon{font-size:32px;margin-bottom:12px}.verification-section h3{font-size:20px;font-weight:600;color:#1a1a1a;margin-bottom:8px}.section-description{font-size:14px;color:#6b7280;margin-bottom:20px}.upload-area{margin-top:16px}.file-input{display:none}.upload-label{display:block;padding:32px;border:2px dashed #d1d5db;border-radius:12px;background:white;cursor:pointer;transition:all .3s ease}.upload-label:hover{border-color:#4b9b97;background:#f0f9f7}.upload-label.secondary{padding:24px;background:#f9fafb}.upload-placeholder{display:flex;flex-direction:column;align-items:center;gap:8px}.upload-icon{width:40px;height:40px;color:#9ca3af}.upload-text{font-size:16px;font-weight:500;color:#374151}.upload-hint{font-size:13px;color:#9ca3af}.preview-container{display:flex;flex-direction:column;align-items:center;gap:12px}.doc-preview{max-width:200px;max-height:150px;object-fit:cover;border-radius:8px}.change-text{font-size:14px;color:#4b9b97;font-weight:500}.checkbox-group{margin-top:16px}.checkbox-label{display:flex;align-items:center;cursor:pointer}.checkbox-input{display:none}.checkbox-custom{width:24px;height:24px;border:2px solid #d1d5db;border-radius:6px;margin-right:12px;position:relative;transition:all .3s ease}.checkbox-input:checked+.checkbox-custom{background:#4b9b97;border-color:#4b9b97}.checkbox-input:checked+.checkbox-custom::after{content:'✓';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:white;font-size:14px}.checkbox-text{font-size:15px;color:#374151}.dbs-details{margin-top:16px}.form-input,.form-textarea{width:100%;padding:12px 16px;border:2px solid #e5e7eb;border-radius:8px;font-size:16px;outline:none}.form-input:focus,.form-textarea:focus{border-color:#4b9b97}.form-textarea{font-family:inherit;resize:vertical}.trust-badge{display:flex;gap:16px;padding:20px;background:linear-gradient(135deg,#f0f9f7 0%,#e8f5f3 100%);border-radius:12px;align-items:center}.badge-icon{font-size:32px}.badge-content h4{font-size:16px;font-weight:600;color:#1a1a1a;margin-bottom:4px}.badge-content p{font-size:14px;color:#6b7280}.preview-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:10px}.preview-grid img{width:100%;height:80px;object-fit:cover;border-radius:4px}
      `}</style>
    </div>
  );
};
export default CleanerStep3;