// components/onboarding/steps/EmployerStep2.jsx
"use client";

const EmployerStep2 = ({ formData, errors, onUpdate }) => {
  const propertyTypes = [
    { id: 'apartment', label: 'Apartment', icon: '🏢' },
    { id: 'house', label: 'House', icon: '🏠' },
    { id: 'office', label: 'Office', icon: '💼' },
    { id: 'commercial', label: 'Commercial', icon: '🏪' }
  ];

  const propertySizes = [
    { id: 'studio', label: 'Studio/1BR', sqft: '< 800 sqft' },
    { id: 'small', label: '2BR', sqft: '800-1200 sqft' },
    { id: 'medium', label: '3BR', sqft: '1200-2000 sqft' },
    { id: 'large', label: '4BR+', sqft: '> 2000 sqft' },
    { id: 'commercial_small', label: 'Small Office', sqft: '< 2000 sqft' },
    { id: 'commercial_large', label: 'Large Office', sqft: '> 2000 sqft' }
  ];

  const displayedSizes = formData.property_type === 'office' || formData.property_type === 'commercial'
    ? propertySizes.filter(s => s.id.includes('commercial'))
    : propertySizes.filter(s => !s.id.includes('commercial'));

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Your Property Details</h2>
        <p>Help cleaners understand your space</p>
      </div>

      <div className="form-content">
        {/* Service Address */}
        <div className="form-group">
          <label className="form-label">
            Service Address <span className="required">*</span>
          </label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => onUpdate('location', e.target.value)}
            className={`form-input ${errors.location ? 'error' : ''}`}
            placeholder="123 Main St, City, State ZIP"
          />
          {errors.location && <span className="error-message">{errors.location}</span>}
        </div>

        {/* Property Type */}
        <div className="form-group">
          <label className="form-label">
            Property Type <span className="required">*</span>
          </label>
          <div className="property-grid">
            {propertyTypes.map(type => (
              <div
                key={type.id}
                onClick={() => onUpdate('property_type', type.id)}
                className={`property-card ${formData.property_type === type.id ? 'active' : ''}`}
              >
                <span className="property-icon">{type.icon}</span>
                <span className="property-label">{type.label}</span>
              </div>
            ))}
          </div>
          {errors.property_type && <span className="error-message">{errors.property_type}</span>}
        </div>

        {/* Property Size */}
        <div className="form-group">
          <label className="form-label">
            Property Size
          </label>
          <div className="size-options">
            {displayedSizes.map(size => (
              <button
                key={size.id}
                type="button"
                onClick={() => onUpdate('property_size', size.id)}
                className={`size-btn ${formData.property_size === size.id ? 'active' : ''}`}
              >
                <span className="size-label">{size.label}</span>
                <span className="size-sqft">{size.sqft}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Number of Rooms (for homes) */}
        {(formData.property_type === 'house' || formData.property_type === 'apartment') && (
          <div className="room-details">
            <label className="form-label">Room Details</label>
            <div className="room-grid">
              <div className="room-item">
                <label>Bedrooms</label>
                <input
                  type="number"
                  value={formData.bedrooms || ''}
                  onChange={(e) => onUpdate('bedrooms', e.target.value)}
                  className="room-input"
                  min="0"
                  max="10"
                />
              </div>
              <div className="room-item">
                <label>Bathrooms</label>
                <input
                  type="number"
                  value={formData.bathrooms || ''}
                  onChange={(e) => onUpdate('bathrooms', e.target.value)}
                  className="room-input"
                  min="0"
                  max="10"
                  step="0.5"
                />
              </div>
            </div>
          </div>
        )}

        {/* Parking Availability */}
        <div className="form-group">
          <label className="form-label">
            Parking & Access
          </label>
          <div className="access-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.parking_available || false}
                onChange={(e) => onUpdate('parking_available', e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">Free parking available</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.elevator_access || false}
                onChange={(e) => onUpdate('elevator_access', e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">Elevator access</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.pets || false}
                onChange={(e) => onUpdate('pets', e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">Pets in property</span>
            </label>
          </div>
        </div>

        {/* Access Instructions */}
        <div className="form-group">
          <label className="form-label">
            Access Instructions (Optional)
          </label>
          <textarea
            value={formData.access_instructions || ''}
            onChange={(e) => onUpdate('access_instructions', e.target.value)}
            className="form-textarea"
            rows={3}
            placeholder="e.g., Doorman building, use side entrance, code is 1234"
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

        .form-input {
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          outline: none;
        }

        .form-input:focus {
          border-color: #4b9b97;
        }

        .form-input.error {
          border-color: #ef4444;
        }

        .property-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
        }

        .property-card {
          padding: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .property-card:hover {
          border-color: #4b9b97;
        }

        .property-card.active {
          background: linear-gradient(135deg, #f0f9f7 0%, #e8f5f3 100%);
          border-color: #4b9b97;
        }

        .property-icon {
          display: block;
          font-size: 32px;
          margin-bottom: 8px;
        }

        .property-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .size-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
        }

        .size-btn {
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .size-btn:hover {
          border-color: #4b9b97;
        }

        .size-btn.active {
          background: #4b9b97;
          color: white;
          border-color: #4b9b97;
        }

        .size-label {
          display: block;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .size-sqft {
          display: block;
          font-size: 12px;
          opacity: 0.8;
        }

        .room-details {
          padding: 20px;
          background: #f9fafb;
          border-radius: 12px;
        }

        .room-details .form-label {
          margin-bottom: 16px;
        }

        .room-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .room-item label {
          display: block;
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .room-input {
          width: 100%;
          padding: 10px;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          text-align: center;
          font-size: 16px;
          outline: none;
        }

        .room-input:focus {
          border-color: #4b9b97;
        }

        .access-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .checkbox-input {
          display: none;
        }

        .checkbox-custom {
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          margin-right: 12px;
          position: relative;
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

export default EmployerStep2;