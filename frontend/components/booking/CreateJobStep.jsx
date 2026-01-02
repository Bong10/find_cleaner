"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateJobField, setJobServices } from "@/store/slices/jobsSlice";
import { toast } from "react-toastify";

const CreateJobStep = ({ onComplete, onBack, cleanerId }) => {
  const dispatch = useDispatch();
  const jobForm = useSelector((state) => state.jobs?.form) || {};
  const { list: services = [] } = useSelector((state) => state.services) || {};
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!jobForm.title?.trim()) {
      newErrors.title = "Job title is required";
    }
    if (!jobForm.description?.trim()) {
      newErrors.description = "Description is required";
    }
    if (!jobForm.location?.trim()) {
      newErrors.location = "Location is required";
    }
    if (!jobForm.date) {
      newErrors.date = "Date is required";
    }
    if (!jobForm.time) {
      newErrors.time = "Time is required";
    }
    if (!jobForm.services || jobForm.services.length === 0) {
      newErrors.services = "Please select at least one service";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required fields");
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onComplete();
    }
  };
  
  return (
    <>
      <style jsx>{`
        .create-job-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .step-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .step-title {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 15px;
        }
        
        .step-subtitle {
          font-size: 16px;
          color: #6b7280;
        }
        
        .form-container {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }
        
        .form-section {
          margin-bottom: 35px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .section-title i {
          color: #667eea;
        }
        
        .form-group {
          margin-bottom: 25px;
        }
        
        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }
        
        .required {
          color: #ef4444;
          margin-left: 4px;
        }
        
        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.3s ease;
          background: white;
        }
        
        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .form-input.error,
        .form-textarea.error {
          border-color: #ef4444;
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        
        .services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        
        .service-item {
          display: flex;
          align-items: center;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .service-item:hover {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.05);
        }
        
        .service-item.selected {
          border-color: #667eea;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        }
        
        .service-checkbox {
          width: 20px;
          height: 20px;
          margin-right: 12px;
          cursor: pointer;
        }
        
        .service-label {
          flex: 1;
          cursor: pointer;
          color: #374151;
          font-weight: 500;
        }
        
        .error-message {
          color: #ef4444;
          font-size: 13px;
          margin-top: 6px;
        }
        
        .info-box {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border: 1px solid rgba(102, 126, 234, 0.2);
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 25px;
        }
        
        .info-box-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .info-box i {
          color: #667eea;
          font-size: 20px;
        }
        
        .info-box p {
          margin: 0;
          color: #4b5563;
          font-size: 14px;
        }
        
        .action-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 40px;
        }
        
        .btn {
          padding: 15px 35px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        
        .btn-secondary {
          background: #f3f4f6;
          color: #4b5563;
        }
        
        .btn-secondary:hover {
          background: #e5e7eb;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .services-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      
      <div className="create-job-container">
        <div className="step-header">
          <h2 className="step-title">Create New Job</h2>
          <p className="step-subtitle">Define your cleaning requirements</p>
        </div>
        
        <div className="form-container">
          <div className="info-box">
            <div className="info-box-content">
              <i className="la la-info-circle"></i>
              <p>This job will be directly assigned to your selected cleaner upon confirmation</p>
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="section-title">
              <i className="la la-briefcase"></i>
              Job Details
            </h3>
            
            <div className="form-group">
              <label className="form-label">
                Job Title <span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="e.g., Weekly Office Cleaning"
                value={jobForm.title || ""}
                onChange={(e) => dispatch(updateJobField({ 
                  name: 'title', 
                  value: e.target.value 
                }))}
              />
              {errors.title && <div className="error-message">{errors.title}</div>}
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Description <span className="required">*</span>
              </label>
              <textarea
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Describe the cleaning requirements, special instructions, areas to focus on..."
                value={jobForm.description || ""}
                onChange={(e) => dispatch(updateJobField({ 
                  name: 'description', 
                  value: e.target.value 
                }))}
              />
              {errors.description && <div className="error-message">{errors.description}</div>}
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="section-title">
              <i className="la la-map-marker"></i>
              Location & Schedule
            </h3>
            
            <div className="form-group">
              <label className="form-label">
                Location <span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.location ? 'error' : ''}`}
                placeholder="Enter full address"
                value={jobForm.location || ""}
                onChange={(e) => dispatch(updateJobField({ 
                  name: 'location', 
                  value: e.target.value 
                }))}
              />
              {errors.location && <div className="error-message">{errors.location}</div>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  className={`form-input ${errors.date ? 'error' : ''}`}
                  value={jobForm.date || ""}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => dispatch(updateJobField({ 
                    name: 'date', 
                    value: e.target.value 
                  }))}
                />
                {errors.date && <div className="error-message">{errors.date}</div>}
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Time <span className="required">*</span>
                </label>
                <input
                  type="time"
                  className={`form-input ${errors.time ? 'error' : ''}`}
                  value={jobForm.time || ""}
                  onChange={(e) => dispatch(updateJobField({ 
                    name: 'time', 
                    value: e.target.value 
                  }))}
                />
                {errors.time && <div className="error-message">{errors.time}</div>}
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="section-title">
              <i className="la la-pound-sign"></i>
              Pricing & Duration
            </h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Hourly Rate (£)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="20"
                  value={jobForm.hourly_rate || ""}
                  min="0"
                  step="0.01"
                  onChange={(e) => dispatch(updateJobField({ 
                    name: 'hourly_rate', 
                    value: e.target.value 
                  }))}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Hours Required</label>
                <input
                  type="number"
                  className="form-input"
                  value={jobForm.hours_required || 1}
                  min="1"
                  onChange={(e) => dispatch(updateJobField({ 
                    name: 'hours_required', 
                    value: e.target.value 
                  }))}
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="section-title">
              <i className="la la-check-square"></i>
              Services Required <span className="required">*</span>
            </h3>
            
            <div className="services-grid">
              {services.map(service => (
                <div
                  key={service.id}
                  className={`service-item ${
                    jobForm.services?.includes(service.id) ? 'selected' : ''
                  }`}
                  onClick={() => {
                    const currentServices = jobForm.services || [];
                    const newServices = currentServices.includes(service.id)
                      ? currentServices.filter(id => id !== service.id)
                      : [...currentServices, service.id];
                    dispatch(setJobServices(newServices));
                  }}
                >
                  <input
                    type="checkbox"
                    className="service-checkbox"
                    checked={jobForm.services?.includes(service.id) || false}
                    readOnly
                  />
                  <label className="service-label">{service.name}</label>
                </div>
              ))}
            </div>
            {errors.services && <div className="error-message">{errors.services}</div>}
          </div>
          
          <div className="action-buttons">
            <button className="btn btn-secondary" onClick={onBack}>
              <i className="la la-arrow-left"></i>
              Back
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Continue
              <i className="la la-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateJobStep;