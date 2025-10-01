// components/onboarding/steps/CleanerStep2.jsx
"use client";
import { useState } from 'react';

const CleanerStep2 = ({ formData, errors, onUpdate }) => {
  const serviceTypes = [
    { id: 'house', label: 'House Cleaning', icon: '🏠' },
    { id: 'office', label: 'Office Cleaning', icon: '🏢' },
    { id: 'deep', label: 'Deep Cleaning', icon: '✨' },
    { id: 'move', label: 'Move In/Out', icon: '📦' },
    { id: 'window', label: 'Window Cleaning', icon: '🪟' },
    { id: 'carpet', label: 'Carpet Cleaning', icon: '🏘️' },
    { id: 'laundry', label: 'Laundry Service', icon: '👔' },
    { id: 'organizing', label: 'Organizing', icon: '📂' }
  ];

  const availabilityDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const [availability, setAvailability] = useState(formData.availability || {});

  const toggleService = (serviceId) => {
    const current = formData.service_types || [];
    if (current.includes(serviceId)) {
      onUpdate('service_types', current.filter(s => s !== serviceId));
    } else {
      onUpdate('service_types', [...current, serviceId]);
    }
  };

  const toggleDay = (day) => {
    const newAvailability = {
      ...availability,
      [day]: !availability[day]
    };
    setAvailability(newAvailability);
    onUpdate('availability', newAvailability);
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Your Professional Details</h2>
        <p>Tell us about your cleaning experience and services</p>
      </div>

      <div className="form-content">
        {/* Years of Experience */}
        <div className="form-group">
          <label className="form-label">
            Years of Experience <span className="required">*</span>
          </label>
          <div className="experience-options">
            {['Less than 1', '1-2', '3-5', '5-10', '10+'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => onUpdate('years_of_experience', option)}
                className={`experience-btn ${formData.years_of_experience === option ? 'active' : ''}`}
              >
                {option} {option === 'Less than 1' ? 'year' : 'years'}
              </button>
            ))}
          </div>
          {errors.years_of_experience && <span className="error-message">{errors.years_of_experience}</span>}
        </div>

        {/* Service Types */}
        <div className="form-group">
          <label className="form-label">
            Services You Offer <span className="required">*</span>
          </label>
          <div className="services-grid">
            {serviceTypes.map(service => (
              <div
                key={service.id}
                onClick={() => toggleService(service.id)}
                className={`service-card ${formData.service_types?.includes(service.id) ? 'selected' : ''}`}
              >
                <span className="service-icon">{service.icon}</span>
                <span className="service-label">{service.label}</span>
                {formData.service_types?.includes(service.id) && (
                  <span className="check-mark">✓</span>
                )}
              </div>
            ))}
          </div>
          {errors.service_types && <span className="error-message">{errors.service_types}</span>}
        </div>

        {/* Availability */}
        <div className="form-group">
          <label className="form-label">
            Your Availability
          </label>
          <div className="availability-grid">
            {availabilityDays.map(day => (
              <div
                key={day}
                onClick={() => toggleDay(day)}
                className={`day-chip ${availability[day] ? 'active' : ''}`}
              >
                {day.slice(0, 3)}
              </div>
            ))}
          </div>
        </div>

        {/* Clean Level */}
        <div className="form-group">
          <label className="form-label">
            Cleaning Expertise Level
          </label>
          <div className="level-selector">
            {[1, 2, 3, 4, 5].map(level => (
              <button
                key={level}
                type="button"
                onClick={() => onUpdate('clean_level', level)}
                className={`level-btn ${formData.clean_level === level ? 'active' : ''}`}
              >
                <span className="level-stars">{'⭐'.repeat(level)}</span>
                <span className="level-text">
                  {level === 1 && 'Beginner'}
                  {level === 2 && 'Basic'}
                  {level === 3 && 'Intermediate'}
                  {level === 4 && 'Advanced'}
                  {level === 5 && 'Expert'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Service Areas */}
        <div className="form-group">
          <label className="form-label">
            Service Areas (Cities/Neighborhoods)
          </label>
          <textarea
            value={formData.service_areas?.join(', ') || ''}
            onChange={(e) => onUpdate('service_areas', e.target.value.split(',').map(s => s.trim()))}
            className="form-textarea"
            placeholder="e.g., Downtown, Westside, Brooklyn Heights"
            rows={3}
          />
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

        .experience-options {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .experience-btn {
          padding: 10px 20px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          color: #6b7280;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .experience-btn:hover {
          border-color: #4b9b97;
        }

        .experience-btn.active {
          background: #4b9b97;
          color: white;
          border-color: #4b9b97;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 12px;
        }

        .service-card {
          position: relative;
          padding: 16px 12px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
        }

        .service-card:hover {
          border-color: #4b9b97;
          transform: translateY(-2px);
        }

        .service-card.selected {
          background: linear-gradient(135deg, #f0f9f7 0%, #e8f5f3 100%);
          border-color: #4b9b97;
        }

        .service-icon {
          display: block;
          font-size: 28px;
          margin-bottom: 8px;
        }

        .service-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }

        .check-mark {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 20px;
          height: 20px;
          background: #4b9b97;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .availability-grid {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .day-chip {
          padding: 10px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 20px;
          background: white;
          color: #6b7280;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .day-chip:hover {
          border-color: #4b9b97;
        }

        .day-chip.active {
          background: #4b9b97;
          color: white;
          border-color: #4b9b97;
        }

        .level-selector {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .level-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .level-btn:hover {
          border-color: #4b9b97;
        }

        .level-btn.active {
          background: linear-gradient(135deg, #f0f9f7 0%, #e8f5f3 100%);
          border-color: #4b9b97;
        }

        .level-stars {
          font-size: 14px;
        }

        .level-text {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .form-textarea {
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          font-family: inherit;
          resize: vertical;
          outline: none;
        }

        .form-textarea:focus {
          border-color: #4b9b97;
        }

        .error-message {
          color: #ef4444;
          font-size: 13px;
          margin-top: 6px;
        }
      `}</style>
    </div>
  );
};

export default CleanerStep2;