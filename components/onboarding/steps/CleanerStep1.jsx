// components/onboarding/steps/CleanerStep1.jsx
"use client";
import { useState } from 'react';
import Image from 'next/image';
import 'react-phone-number-input/style.css'; // Import the library's styles
import PhoneInput from 'react-phone-number-input';

const CleanerStep1 = ({ formData, errors, onUpdate }) => {
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpdate('profile_picture', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Let's get to know you</h2>
        <p>This information helps clients trust and connect with you</p>
      </div>

      <div className="form-content">
        {/* Profile Picture Upload */}
        <div className="photo-upload-section">
          <label className="photo-label">Profile Photo</label>
          <div className="photo-upload-container">
            <div className="photo-preview">
              {previewImage || formData.profile_picture ? (
                <img 
                  src={previewImage || formData.profile_picture} 
                  alt="Profile" 
                  className="preview-image"
                />
              ) : (
                <div className="photo-placeholder">
                  <svg className="camera-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Upload Photo</span>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
              id="profile-photo"
            />
            <label htmlFor="profile-photo" className="upload-btn">
              Choose Photo
            </label>
            <p className="photo-hint">Professional photo increases trust by 40%</p>
          </div>
        </div>

        {/* Name Field */}
        <div className="form-group">
          <label className="form-label">
            Full Name <span className="required">*</span>
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => onUpdate('name', e.target.value)}
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="Enter your full name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        {/* UPDATED: Phone Number Input */}
        <div className="form-group">
          <label className="form-label">
            Phone Number <span className="required">*</span>
          </label>
          <PhoneInput
            international
            defaultCountry="GB" // Sets Cameroon as the default country
            value={formData.phone_number || ''}
            onChange={(value) => onUpdate('phone_number', value)}
            className={`phone-input-component ${errors.phone_number ? 'error' : ''}`}
          />
          {errors.phone_number && <span className="error-message">{errors.phone_number}</span>}
        </div>

        {/* Gender and Date of Birth - Side by Side */}
        <div className="address-row">
          <div className="form-group">
            <label className="form-label">
              Gender
            </label>
            <select
              value={formData.gender || ''}
              onChange={(e) => onUpdate('gender', e.target.value)}
              className="form-input"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.date_of_birth || ''}
              onChange={(e) => onUpdate('date_of_birth', e.target.value)}
              className="form-input"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        <p className="field-hint" style={{ marginTop: '-10px' }}>Must be 18 or older to join</p>

        {/* UK Standard Address Fields */}
        <div className="form-group">
          <label className="form-label">
            Address Line 1 <span className="required">*</span>
          </label>
          <input
            type="text"
            value={formData.address_line1 || ''}
            onChange={(e) => onUpdate('address_line1', e.target.value)}
            className={`form-input ${errors.address_line1 ? 'error' : ''}`}
            placeholder="House number and street name"
          />
          {errors.address_line1 && <span className="error-message">{errors.address_line1}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Address Line 2
          </label>
          <input
            type="text"
            value={formData.address_line2 || ''}
            onChange={(e) => onUpdate('address_line2', e.target.value)}
            className="form-input"
            placeholder="Apartment, suite, unit, etc. (optional)"
          />
        </div>

        <div className="address-row">
          <div className="form-group">
            <label className="form-label">
              Town/City <span className="required">*</span>
            </label>
            <input
              type="text"
              value={formData.city || ''}
              onChange={(e) => onUpdate('city', e.target.value)}
              className={`form-input ${errors.city ? 'error' : ''}`}
              placeholder="e.g., London"
            />
            {errors.city && <span className="error-message">{errors.city}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              County
            </label>
            <input
              type="text"
              value={formData.county || ''}
              onChange={(e) => onUpdate('county', e.target.value)}
              className="form-input"
              placeholder="e.g., Greater London"
            />
          </div>
        </div>

        <div className="address-row">
          <div className="form-group">
            <label className="form-label">
              Postcode <span className="required">*</span>
            </label>
            <input
              type="text"
              value={formData.postcode || ''}
              onChange={(e) => onUpdate('postcode', e.target.value.toUpperCase())}
              className={`form-input ${errors.postcode ? 'error' : ''}`}
              placeholder="e.g., SW1A 1AA"
              maxLength={8}
            />
            {errors.postcode && <span className="error-message">{errors.postcode}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Country
            </label>
            <input
              type="text"
              value={formData.country || 'United Kingdom'}
              onChange={(e) => onUpdate('country', e.target.value)}
              className="form-input"
              readOnly
            />
          </div>
        </div>

        {/* Bio */}
        <div className="form-group">
          <label className="form-label">
            About You
          </label>
          <textarea
            value={formData.bio || ''}
            onChange={(e) => onUpdate('bio', e.target.value)}
            className="form-textarea"
            rows={4}
            placeholder="Tell clients about yourself, your experience, and what makes you great at cleaning..."
            maxLength={500}
          />
          <p className="char-count">{formData.bio?.length || 0}/500</p>
        </div>
      </div>

      <style jsx>{`
        .step-container {
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        .step-header { margin-bottom: 40px; }
        .step-header h2 { font-size: 32px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; }
        .step-header p { font-size: 16px; color: #6b7280; }
        .form-content { display: flex; flex-direction: column; gap: 32px; }
        .address-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 640px) {
          .address-row { grid-template-columns: 1fr; }
        }
        .photo-upload-section { text-align: center; }
        .photo-label { display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 16px; }
        .photo-upload-container { display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .photo-preview { width: 150px; height: 150px; border-radius: 50%; overflow: hidden; background: #f3f4f6; display: flex; align-items: center; justify-content: center; }
        .preview-image { width: 100%; height: 100%; object-fit: cover; }
        .photo-placeholder { display: flex; flex-direction: column; align-items: center; gap: 8px; color: #9ca3af; }
        .camera-icon { width: 40px; height: 40px; }
        .file-input { display: none; }
        .upload-btn { padding: 10px 24px; background: #4b9b97; color: white; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .upload-btn:hover { background: #3d7d7a; }
        .photo-hint { font-size: 13px; color: #4b9b97; margin-top: 8px; }
        .form-group { display: flex; flex-direction: column; }
        .form-label { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; }
        .required { color: #ef4444; }
        .form-input, .form-textarea {
          padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 8px;
          font-size: 16px; transition: all 0.3s ease; outline: none;
        }
        .form-input:focus, .form-textarea:focus {
          border-color: #4b9b97;
          box-shadow: 0 0 0 3px rgba(75, 155, 151, 0.1);
        }
        .form-input.error { border-color: #ef4444; }
        .form-textarea { font-family: inherit; resize: vertical; }
        .field-hint { font-size: 13px; color: #6b7280; margin-top: 6px; }
        .char-count { font-size: 12px; color: #9ca3af; text-align: right; margin-top: 4px; }
        .error-message { color: #ef4444; font-size: 13px; margin-top: 6px; }
        
        @media (max-width: 640px) {
          .step-container { padding: 24px; }
          .step-header h2 { font-size: 24px; }
        }

        /* Styles for the react-phone-number-input library */
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
      `}</style>
    </div>
  );
};

export default CleanerStep1;