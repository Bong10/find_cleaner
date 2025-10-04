// components/onboarding/steps/EmployerStep1.jsx
"use client";
import { useState } from 'react';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';

const EmployerStep1 = ({ formData, errors, onUpdate }) => {
  const [logoPreview, setLogoPreview] = useState(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpdate('profile_picture', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const accountTypes = [
    { id: 'individual', label: 'Individual', icon: '👤', description: 'Personal home cleaning' },
    { id: 'business', label: 'Business', icon: '🏢', description: 'Office or commercial cleaning' }
  ];

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Tell us about yourself</h2>
        <p>Help cleaners understand who they'll be working with</p>
      </div>

      <div className="form-content">
        {/* Account Type */}
        <div className="form-group">
          <label className="form-label">
            Account Type <span className="required">*</span>
          </label>
          <div className="account-types">
            {accountTypes.map(type => (
              <div
                key={type.id}
                onClick={() => onUpdate('account_type', type.id)}
                className={`account-card ${formData.account_type === type.id ? 'active' : ''}`}
              >
                <span className="account-icon">{type.icon}</span>
                <div className="account-info">
                  <span className="account-label">{type.label}</span>
                  <span className="account-desc">{type.description}</span>
                </div>
                {formData.account_type === type.id && (
                  <span className="check-circle">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Name/Business Name Field */}
        <div className="form-group">
          <label className="form-label">
            {formData.account_type === 'business' ? 'Business Name' : 'Full Name'} <span className="required">*</span>
          </label>
          <input
            type="text"
            value={formData.name || formData.business_name || ''}
            onChange={(e) => onUpdate(formData.account_type === 'business' ? 'business_name' : 'name', e.target.value)}
            className={`form-input ${errors.name || errors.business_name ? 'error' : ''}`}
            placeholder={formData.account_type === 'business' ? 'Enter business name' : 'Enter your full name'}
          />
          {(errors.name || errors.business_name) && <span className="error-message">{errors.name || errors.business_name}</span>}
        </div>

        {/* UPDATED: Phone Number Input - Same as CleanerStep1 */}
        <div className="form-group">
          <label className="form-label">
            Phone Number <span className="required">*</span>
          </label>
          <PhoneInput
            international
            defaultCountry="GB"
            value={formData.phone_number || ''}
            onChange={(value) => onUpdate('phone_number', value)}
            className={`phone-input-component ${errors.phone_number ? 'error' : ''}`}
          />
          {errors.phone_number && <span className="error-message">{errors.phone_number}</span>}
        </div>

        {/* Logo/Profile Picture */}
        <div className="form-group">
          <label className="form-label">
            {formData.account_type === 'business' ? 'Company Logo' : 'Profile Photo'} (Optional)
          </label>
          <div className="logo-upload-section">
            <div className="logo-preview">
              {logoPreview || formData.profile_picture ? (
                <img 
                  src={logoPreview || formData.profile_picture} 
                  alt="Logo" 
                  className="logo-image"
                />
              ) : (
                <div className="logo-placeholder">
                  {formData.account_type === 'business' ? '🏢' : '👤'}
                </div>
              )}
            </div>
            <div className="upload-controls">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                id="logo-upload"
                className="file-input"
              />
              <label htmlFor="logo-upload" className="upload-btn">
                Choose Image
              </label>
              <p className="upload-hint">JPG, PNG (max 5MB)</p>
            </div>
          </div>
        </div>

        {/* Email Notifications */}
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.email_notifications !== false}
              onChange={(e) => onUpdate('email_notifications', e.target.checked)}
              className="checkbox-input"
            />
            <span className="checkbox-custom"></span>
            <span className="checkbox-text">
              Send me updates about new cleaners and service improvements
            </span>
          </label>
        </div>

        {/* About Section */}
        <div className="form-group">
          <label className="form-label">
            About {formData.account_type === 'business' ? 'Your Business' : 'You'} (Optional)
          </label>
          <textarea
            value={formData.about || ''}
            onChange={(e) => onUpdate('about', e.target.value)}
            className="form-textarea"
            rows={4}
            placeholder={
              formData.account_type === 'business' 
                ? "Tell cleaners about your business, cleaning needs, and work environment..."
                : "Tell cleaners about yourself, your home, and what you're looking for..."
            }
            maxLength={500}
          />
          <p className="char-count">{formData.about?.length || 0}/500</p>
        </div>
      </div>

      <style jsx>{`
        .step-container {
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .step-header {
          margin-bottom: 40px;
        }

        .step-header h2 {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .step-header p {
          font-size: 16px;
          color: #6b7280;
        }

        .form-content {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 12px;
        }

        .required {
          color: #ef4444;
        }

        .account-types {
          display: flex;
          gap: 16px;
        }

        .account-card {
          flex: 1;
          padding: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .account-card:hover {
          border-color: #4b9b97;
          background: #fafafa;
        }

        .account-card.active {
          border-color: #4b9b97;
          background: linear-gradient(135deg, #f0f9f7 0%, #e8f5f3 100%);
        }

        .account-icon {
          font-size: 32px;
        }

        .account-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .account-label {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 4px;
        }

        .account-desc {
          font-size: 13px;
          color: #6b7280;
        }

        .check-circle {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 24px;
          height: 24px;
          background: #4b9b97;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .form-input {
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-input:focus {
          border-color: #4b9b97;
          box-shadow: 0 0 0 3px rgba(75, 155, 151, 0.1);
        }

        .form-input.error {
          border-color: #ef4444;
        }

        .logo-upload-section {
          display: flex;
          gap: 24px;
          align-items: center;
        }

        .logo-preview {
          width: 100px;
          height: 100px;
          border-radius: 12px;
          overflow: hidden;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .logo-placeholder {
          font-size: 48px;
        }

        .upload-controls {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .file-input {
          display: none;
        }

        .upload-btn {
          padding: 10px 24px;
          background: #4b9b97;
          color: white;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .upload-btn:hover {
          background: #3d7d7a;
        }

        .upload-hint {
          font-size: 12px;
          color: #9ca3af;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          cursor: pointer;
        }

        .checkbox-input {
          display: none;
        }

        .checkbox-custom {
          width: 20px;
          height: 20px;
          min-width: 20px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          margin-right: 12px;
          margin-top: 2px;
          position: relative;
          transition: all 0.3s ease;
        }

        .checkbox-input:checked + .checkbox-custom {
          background: #4b9b97;
          border-color: #4b9b97;
        }

        .checkbox-input:checked + .checkbox-custom::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
        }

        .checkbox-text {
          font-size: 14px;
          color: #374151;
          line-height: 1.5;
        }

        .form-textarea {
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          font-family: inherit;
          resize: vertical;
          outline: none;
          transition: all 0.3s ease;
        }

        .form-textarea:focus {
          border-color: #4b9b97;
          box-shadow: 0 0 0 3px rgba(75, 155, 151, 0.1);
        }

        .char-count {
          font-size: 12px;
          color: #9ca3af;
          text-align: right;
          margin-top: 4px;
        }

        .error-message {
          color: #ef4444;
          font-size: 13px;
          margin-top: 6px;
        }

        /* Add the same phone input styles from CleanerStep1 */
        :global(.phone-input-component .PhoneInputInput) {
          padding: 12px 16px !important;
          border: 2px solid #e5e7eb !important;
          border-radius: 8px !important;
          font-size: 16px !important;
          transition: all 0.3s ease !important;
          outline: none !important;
          width: 100%;
        }
        :global(.phone-input-component .PhoneInputInput:focus) {
          border-color: #4b9b97 !important;
          box-shadow: 0 0 0 3px rgba(75, 155, 151, 0.1) !important;
        }
        :global(.phone-input-component.error .PhoneInputInput) {
          border-color: #ef4444 !important;
        }
        :global(.PhoneInputCountrySelect) {
          margin-right: 8px;
        }

        @media (max-width: 640px) {
          .step-container {
            padding: 24px;
          }

          .step-header h2 {
            font-size: 24px;
          }

          .account-types {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default EmployerStep1;