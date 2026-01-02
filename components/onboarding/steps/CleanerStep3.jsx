// components/onboarding/steps/CleanerStep3.jsx
"use client";
import { useState } from 'react';

const CleanerStep3 = ({ formData, onUpdate, errors = {} }) => {
  const [previews, setPreviews] = useState({ idFront: null, idBack: null, cv: null });
  const [expandedRef, setExpandedRef] = useState({ professional: false, character: false });

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (type === 'id_document_front') {
      const file = files[0];
      onUpdate('id_document_front', file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviews(prev => ({ ...prev, idFront: reader.result }));
      reader.readAsDataURL(file);
    } else if (type === 'id_document_back') {
      const file = files[0];
      onUpdate('id_document_back', file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviews(prev => ({ ...prev, idBack: reader.result }));
      reader.readAsDataURL(file);
    } else if (type === 'cv') {
      const file = files[0];
      onUpdate('cv', file);
      
      // Preview for PDF/DOC
      if (file.type.includes('pdf') || file.type.includes('document')) {
        setPreviews(prev => ({ ...prev, cv: file.name }));
      } else {
        const reader = new FileReader();
        reader.onloadend = () => setPreviews(prev => ({ ...prev, cv: reader.result }));
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Verification & Trust</h2>
        <p>Build trust with clients through verification</p>
      </div>
      <div className="form-content">
        <div className={`verification-section ${errors.id_document_front || errors.id_document_back ? 'has-error' : ''}`}>
          <div className="section-header">
            <div className="section-icon">🆔</div>
            <div className="section-title-group">
              <h3>Identity Verification <span className="required">*</span></h3>
              <p className="section-description">Upload both sides of a government-issued ID (required).</p>
              {(errors.id_document_front || errors.id_document_back) && (
                <p className="error-message">
                  <i className="la la-exclamation-circle"></i> 
                  {errors.id_document_front && errors.id_document_back 
                    ? 'Both front and back sides of ID are required'
                    : errors.id_document_front || errors.id_document_back}
                </p>
              )}
            </div>
          </div>
          <div className="id-upload-grid">
            {/* Front Side */}
            <div className="upload-area">
              <label className="id-label">
                Front Side * 
                {errors.id_document_front && !errors.id_document_back && <span className="field-error-inline"> - Required</span>}
              </label>
              <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'id_document_front')} id="id-front-upload" className="file-input" required/>
              <label htmlFor="id-front-upload" className={`upload-label compact ${errors.id_document_front ? 'error-border' : ''}`}>
                {previews.idFront ? (
                  <div className="preview-container">
                    <img src={previews.idFront} alt="ID Front Preview" className="doc-preview" />
                    <span className="change-text">Click to change</span>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <svg className="upload-icon small" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    <span className="upload-text small">Upload Front</span>
                    <span className="upload-hint">JPEG, PNG, or PDF</span>
                  </div>
                )}
              </label>
            </div>
            
            {/* Back Side */}
            <div className="upload-area">
              <label className="id-label">
                Back Side * 
                {errors.id_document_back && !errors.id_document_front && <span className="field-error-inline"> - Required</span>}
              </label>
              <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'id_document_back')} id="id-back-upload" className="file-input" required/>
              <label htmlFor="id-back-upload" className={`upload-label compact ${errors.id_document_back ? 'error-border' : ''}`}>
                {previews.idBack ? (
                  <div className="preview-container">
                    <img src={previews.idBack} alt="ID Back Preview" className="doc-preview" />
                    <span className="change-text">Click to change</span>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <svg className="upload-icon small" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    <span className="upload-text small">Upload Back</span>
                    <span className="upload-hint">JPEG, PNG, or PDF</span>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>
        <div className="verification-section">
          <div className="section-header">
            <div className="section-icon">✅</div>
            <div className="section-title-group">
              <h3>Background Check (DBS)</h3>
              <p className="section-description">Having a DBS check significantly increases your chances of getting hired.</p>
            </div>
          </div>
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
        <div className={`verification-section ${errors.cv ? 'has-error' : ''}`}>
          <div className="section-header">
            <div className="section-icon">📄</div>
            <div className="section-title-group">
              <h3>Upload Your CV <span className="required">*</span></h3>
              <p className="section-description">Upload your curriculum vitae or resume (PDF, DOC, or DOCX).</p>
              {errors.cv && (
                <p className="error-message">
                  <i className="la la-exclamation-circle"></i> {errors.cv}
                </p>
              )}
            </div>
          </div>
          <div className="upload-area">
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'cv')} id="cv-upload" className="file-input"/>
            <label htmlFor="cv-upload" className={`upload-label secondary ${errors.cv ? 'error-border' : ''}`}>
              {previews.cv ? (
                <div className="preview-container">
                  {typeof previews.cv === 'string' && !previews.cv.startsWith('data:') ? (
                    <div className="doc-info">
                      <svg className="doc-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="doc-name">{previews.cv}</span>
                    </div>
                  ) : (
                    <img src={previews.cv} alt="CV Preview" className="doc-preview" />
                  )}
                  <span className="change-text">Click to change</span>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="upload-text">Upload CV</span>
                  <span className="upload-hint">PDF, DOC, or DOCX (max 5MB)</span>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className={`verification-section ${errors.references ? 'has-error' : ''}`}>
          <div className="section-header">
            <div className="section-icon">👥</div>
            <div className="section-title-group">
              <h3>References <span className="required">*</span></h3>
              <p className="section-description">Please provide at least 2 references (1 professional and 1 character reference).</p>
              {errors.references && (
                <p className="error-message">
                  <i className="la la-exclamation-circle"></i> {errors.references}
                </p>
              )}
            </div>
          </div>
          
          {/* Professional Reference */}
          <div className="reference-group">
            <div 
              className="reference-header" 
              onClick={() => setExpandedRef(prev => ({ ...prev, professional: !prev.professional }))}
            >
              <h4 className="reference-title">Professional Reference</h4>
              <svg 
                className={`expand-icon ${expandedRef.professional ? 'expanded' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {expandedRef.professional && (
              <div className="reference-fields">
                <input
                  type="text"
                  value={formData.professional_ref_name || ''}
                  onChange={(e) => onUpdate('professional_ref_name', e.target.value)}
                  className="form-input"
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  value={formData.professional_ref_relationship || ''}
                  onChange={(e) => onUpdate('professional_ref_relationship', e.target.value)}
                  className="form-input"
                  placeholder="Relationship (e.g., Former Manager)"
                />
                <input
                  type="email"
                  value={formData.professional_ref_email || ''}
                  onChange={(e) => onUpdate('professional_ref_email', e.target.value)}
                  className="form-input"
                  placeholder="Email Address"
                />
                <input
                  type="tel"
                  value={formData.professional_ref_phone || ''}
                  onChange={(e) => onUpdate('professional_ref_phone', e.target.value)}
                  className="form-input"
                  placeholder="Phone Number"
                />
              </div>
            )}
          </div>

          {/* Character Reference */}
          <div className="reference-group">
            <div 
              className="reference-header" 
              onClick={() => setExpandedRef(prev => ({ ...prev, character: !prev.character }))}
            >
              <h4 className="reference-title">Character Reference</h4>
              <svg 
                className={`expand-icon ${expandedRef.character ? 'expanded' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {expandedRef.character && (
              <div className="reference-fields">
                <input
                  type="text"
                  value={formData.character_ref_name || ''}
                  onChange={(e) => onUpdate('character_ref_name', e.target.value)}
                  className="form-input"
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  value={formData.character_ref_relationship || ''}
                  onChange={(e) => onUpdate('character_ref_relationship', e.target.value)}
                  className="form-input"
                  placeholder="Relationship (e.g., Friend, Mentor)"
                />
                <input
                  type="email"
                  value={formData.character_ref_email || ''}
                  onChange={(e) => onUpdate('character_ref_email', e.target.value)}
                  className="form-input"
                  placeholder="Email Address"
                />
                <input
                  type="tel"
                  value={formData.character_ref_phone || ''}
                  onChange={(e) => onUpdate('character_ref_phone', e.target.value)}
                  className="form-input"
                  placeholder="Phone Number"
                />
              </div>
            )}
          </div>
        </div>
        <div className="trust-badge">{/* ... badge JSX ... */}</div>
      </div>
      <style jsx>{`
        .step-container{background:white;border-radius:16px;padding:40px;box-shadow:0 4px 20px rgba(0,0,0,.08)}.step-header{margin-bottom:40px}.step-header h2{font-size:32px;font-weight:700;color:#1a1a1a;margin-bottom:8px}.step-header p{font-size:16px;color:#6b7280}.form-content{display:flex;flex-direction:column;gap:32px}.verification-section{padding:24px;border:1px solid #e5e7eb;border-radius:12px;background:#fafafa;transition:all 0.3s ease}.verification-section.has-error{border-color:#ef4444;background:#fef2f2;box-shadow:0 0 0 3px rgba(239,68,68,0.1)}.section-header{display:flex;align-items:flex-start;gap:16px;margin-bottom:20px}.section-icon{font-size:36px;flex-shrink:0;line-height:1}.section-title-group{flex:1}.verification-section h3{font-size:20px;font-weight:600;color:#1a1a1a;margin-bottom:6px}.verification-section h3 .required{color:#ef4444}.section-description{font-size:14px;color:#6b7280;margin-bottom:0}.error-message{color:#ef4444;font-size:14px;font-weight:600;margin-top:8px;display:flex;align-items:center;gap:6px}.error-message i{font-size:16px}.field-error-inline{color:#ef4444;font-weight:600;font-size:13px}        .upload-area{margin-top:16px}.id-upload-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}@media(max-width:640px){.id-upload-grid{grid-template-columns:1fr}}.id-label{display:block;font-size:14px;font-weight:600;color:#374151;margin-bottom:8px}.file-input{display:none}.upload-label{display:block;padding:32px;border:2px dashed #d1d5db;border-radius:12px;background:white;cursor:pointer;transition:all .3s ease}.upload-label:hover{border-color:#4b9b97;background:#f0f9f7}.upload-label.error-border{border-color:#ef4444;background:#fef2f2;animation:shake 0.5s}.upload-label.error-border:hover{border-color:#dc2626}@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}.upload-label.secondary{padding:24px;background:#f9fafb}.upload-label.compact{padding:20px}.upload-placeholder{display:flex;flex-direction:column;align-items:center;gap:8px}        .upload-icon{width:40px;height:40px;color:#9ca3af}.upload-icon.small{width:32px;height:32px}.upload-text{font-size:16px;font-weight:500;color:#374151}.upload-text.small{font-size:14px}.upload-hint{font-size:13px;color:#9ca3af}.preview-container{display:flex;flex-direction:column;align-items:center;gap:12px}.doc-preview{max-width:200px;max-height:150px;object-fit:cover;border-radius:8px}.doc-info{display:flex;align-items:center;gap:12px;padding:16px;background:#f3f4f6;border-radius:8px}.doc-icon{width:32px;height:32px;color:#4b9b97}.doc-name{font-size:14px;color:#374151;font-weight:500}.change-text{font-size:14px;color:#4b9b97;font-weight:500}.checkbox-group{margin-top:16px}.checkbox-label{display:flex;align-items:center;cursor:pointer}.checkbox-input{display:none}.checkbox-custom{width:24px;height:24px;border:2px solid #d1d5db;border-radius:6px;margin-right:12px;position:relative;transition:all .3s ease}.checkbox-input:checked+.checkbox-custom{background:#4b9b97;border-color:#4b9b97}.checkbox-input:checked+.checkbox-custom::after{content:'✓';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:white;font-size:14px}.checkbox-text{font-size:15px;color:#374151}.dbs-details{margin-top:16px}.form-input,.form-textarea{width:100%;padding:12px 16px;border:2px solid #e5e7eb;border-radius:8px;font-size:16px;outline:none}.form-input:focus,.form-textarea:focus{border-color:#4b9b97}.form-textarea{font-family:inherit;resize:vertical}        .reference-group{margin-top:24px;padding:20px;background:white;border-radius:8px;border:1px solid #e5e7eb}.reference-header{display:flex;justify-content:space-between;align-items:center;cursor:pointer;padding:4px 0;transition:all .2s ease}.reference-header:hover{opacity:.7}.reference-title{font-size:16px;font-weight:600;color:#1a1a1a;margin:0}.expand-icon{width:20px;height:20px;color:#6b7280;transition:transform .3s ease}.expand-icon.expanded{transform:rotate(180deg)}.reference-fields{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px;animation:slideDown .3s ease}.reference-fields input{grid-column:span 1}.reference-fields input:nth-child(1),.reference-fields input:nth-child(3){grid-column:span 1}@keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}@media(max-width:640px){.reference-fields{grid-template-columns:1fr}.reference-fields input{grid-column:span 1!important}}.trust-badge{display:flex;gap:16px;padding:20px;background:linear-gradient(135deg,#f0f9f7 0%,#e8f5f3 100%);border-radius:12px;align-items:center}.badge-icon{font-size:32px}.badge-content h4{font-size:16px;font-weight:600;color:#1a1a1a;margin-bottom:4px}.badge-content p{font-size:14px;color:#6b7280}.preview-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:10px}.preview-grid img{width:100%;height:80px;object-fit:cover;border-radius:4px}
      `}</style>
    </div>
  );
};
export default CleanerStep3;