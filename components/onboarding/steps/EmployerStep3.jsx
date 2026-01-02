// components/onboarding/steps/EmployerStep3.jsx
"use client";

const EmployerStep3 = ({ formData, errors, onUpdate }) => {
  const frequencies = [
    { id: 'one_time', label: 'One-time', icon: '1️⃣', description: 'Single cleaning session' },
    { id: 'weekly', label: 'Weekly', icon: '🗓️', description: 'Every week' },
    { id: 'bi_weekly', label: 'Bi-weekly', icon: '📅', description: 'Every 2 weeks' },
    { id: 'monthly', label: 'Monthly', icon: '📆', description: 'Once a month' }
  ];

  const timeSlots = [
    { id: 'morning', label: 'Morning', time: '8 AM - 12 PM' },
    { id: 'afternoon', label: 'Afternoon', time: '12 PM - 5 PM' },
    { id: 'evening', label: 'Evening', time: '5 PM - 9 PM' },
    { id: 'flexible', label: 'Flexible', time: 'Any time' }
  ];

  const priorities = [
    { id: 'kitchen', label: 'Kitchen Deep Clean', icon: '🍳' },
    { id: 'bathroom', label: 'Bathroom Sanitization', icon: '🚿' },
    { id: 'floors', label: 'Floor Care', icon: '🏠' },
    { id: 'windows', label: 'Window Cleaning', icon: '🪟' },
    { id: 'not_listed', label: 'Not Listed', icon: '📝' }
  ];

  const togglePriority = (priorityId) => {
    const current = formData.cleaning_priorities || [];
    if (current.includes(priorityId)) {
      onUpdate('cleaning_priorities', current.filter(p => p !== priorityId));
      // Clear custom priority if unchecking "Not Listed"
      if (priorityId === 'not_listed') {
        onUpdate('custom_priority', '');
      }
    } else {
      onUpdate('cleaning_priorities', [...current, priorityId]);
    }
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Your Cleaning Needs</h2>
        <p>Tell us what you're looking for</p>
      </div>

      <div className="form-content">
        {/* Service Frequency */}
        <div className="form-group">
          <label className="form-label">
            How often do you need cleaning? <span className="required">*</span>
          </label>
          <div className="frequency-grid">
            {frequencies.map(freq => (
              <div
                key={freq.id}
                onClick={() => onUpdate('service_frequency', freq.id)}
                className={`frequency-card ${formData.service_frequency === freq.id ? 'active' : ''}`}
              >
                <span className="freq-icon">{freq.icon}</span>
                <div className="freq-info">
                  <span className="freq-label">{freq.label}</span>
                  <span className="freq-desc">{freq.description}</span>
                </div>
              </div>
            ))}
          </div>
          {errors.service_frequency && <span className="error-message">{errors.service_frequency}</span>}
        </div>

        {/* Preferred Time */}
        <div className="form-group">
          <label className="form-label">
            Preferred Cleaning Time
          </label>
          <div className="time-grid">
            {timeSlots.map(slot => (
              <button
                key={slot.id}
                type="button"
                onClick={() => onUpdate('preferred_time', slot.id)}
                className={`time-btn ${formData.preferred_time === slot.id ? 'active' : ''}`}
              >
                <span className="time-label">{slot.label}</span>
                <span className="time-range">{slot.time}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cleaning Priorities */}
        <div className="form-group">
          <label className="form-label">
            Cleaning Priorities (Select all that apply)
          </label>
          <div className="priorities-grid">
            {priorities.map(priority => (
              <div
                key={priority.id}
                onClick={() => togglePriority(priority.id)}
                className={`priority-card ${formData.cleaning_priorities?.includes(priority.id) ? 'selected' : ''}`}
              >
                <span className="priority-icon">{priority.icon}</span>
                <span className="priority-label">{priority.label}</span>
                {formData.cleaning_priorities?.includes(priority.id) && (
                  <span className="check-mark">✓</span>
                )}
              </div>
            ))}
          </div>
          
          {/* Custom Priority Input */}
          {formData.cleaning_priorities?.includes('not_listed') && (
            <div className="custom-priority-container">
              <div className="custom-input-wrapper">
                <span className="input-icon">📝</span>
                <input
                  type="text"
                  value={formData.custom_priority || ''}
                  onChange={(e) => onUpdate('custom_priority', e.target.value)}
                  className="custom-priority-field"
                  placeholder="What else do you need help with? (e.g. Garage cleaning)"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>

        {/* Special Requirements */}
        <div className="form-group">
          <label className="form-label">
            Special Requirements or Instructions
          </label>
          <textarea
            value={formData.special_requirements || ''}
            onChange={(e) => onUpdate('special_requirements', e.target.value)}
            className="form-textarea"
            rows={4}
            placeholder="e.g., Use eco-friendly products only, allergic to certain chemicals, focus on pet areas..."
          />
        </div>

        {/* Supplies */}
        <div className="form-group">
          <label className="form-label">
            Do you provide cleaning supplies?
          </label>
          <div className="supplies-options">
            <label className="radio-label">
              <input
                type="radio"
                name="supplies"
                checked={formData.supplies_provided === 'yes'}
                onChange={() => onUpdate('supplies_provided', 'yes')}
                className="radio-input"
              />
              <span className="radio-custom"></span>
              <span className="radio-text">Yes</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="supplies"
                checked={formData.supplies_provided === 'no'}
                onChange={() => onUpdate('supplies_provided', 'no')}
                className="radio-input"
              />
              <span className="radio-custom"></span>
              <span className="radio-text">No</span>
            </label>
          </div>
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

        .frequency-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
        }

        .frequency-card {
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .frequency-card:hover {
          border-color: #4b9b97;
        }

        .frequency-card.active {
          background: linear-gradient(135deg, #f0f9f7 0%, #e8f5f3 100%);
          border-color: #4b9b97;
        }

        .freq-icon {
          display: block;
          font-size: 28px;
          margin-bottom: 8px;
        }

        .freq-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .freq-label {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .freq-desc {
          font-size: 12px;
          color: #6b7280;
        }

        .time-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
        }

        .time-btn {
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .time-btn:hover {
          border-color: #4b9b97;
        }

        .time-btn.active {
          background: #4b9b97;
          color: white;
          border-color: #4b9b97;
        }

        .time-label {
          display: block;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .time-range {
          display: block;
          font-size: 12px;
          opacity: 0.8;
        }

        .budget-slider {
          padding: 20px;
          background: #f9fafb;
          border-radius: 12px;
        }

        .budget-inputs {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;
        }

        .budget-input-group {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .currency {
          font-size: 18px;
          color: #6b7280;
        }

        .budget-input {
          width: 80px;
          padding: 10px;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          text-align: center;
          font-size: 16px;
          outline: none;
        }

        .budget-input:focus {
          border-color: #4b9b97;
        }

        .budget-separator {
          color: #9ca3af;
          font-weight: 500;
        }

        .budget-note {
          font-size: 13px;
          color: #6b7280;
        }

        .priorities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
        }

        .priority-card {
          position: relative;
          padding: 16px 12px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .priority-card:hover {
          border-color: #4b9b97;
        }

        .priority-card.selected {
          background: linear-gradient(135deg, #f0f9f7 0%, #e8f5f3 100%);
          border-color: #4b9b97;
        }

        .priority-icon {
          display: block;
          font-size: 28px;
          margin-bottom: 8px;
        }

        .priority-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }

        .check-mark {
          position: absolute;
          top: 6px;
          right: 6px;
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

        .custom-priority-container {
          margin-top: 16px;
          animation: slideDown 0.3s ease-out;
        }
        
        .custom-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          font-size: 20px;
          pointer-events: none;
        }

        .custom-priority-field {
          width: 100%;
          padding: 16px 16px 16px 50px;
          border: 2px solid #4b9b97;
          border-radius: 12px;
          font-size: 16px;
          background: #f0f9f7;
          outline: none;
          transition: all 0.3s ease;
          color: #1a1a1a;
        }

        .custom-priority-field::placeholder {
          color: #6b7280;
        }

        .custom-priority-field:focus {
          background: white;
          box-shadow: 0 4px 12px rgba(75, 155, 151, 0.15);
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
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

        .supplies-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .radio-label {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .radio-input {
          display: none;
        }

        .radio-custom {
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 50%;
          margin-right: 12px;
          position: relative;
        }

        .radio-input:checked + .radio-custom {
          border-color: #4b9b97;
        }

        .radio-input:checked + .radio-custom::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          background: #4b9b97;
          border-radius: 50%;
        }

        .radio-text {
          font-size: 14px;
          color: #374151;
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

export default EmployerStep3;