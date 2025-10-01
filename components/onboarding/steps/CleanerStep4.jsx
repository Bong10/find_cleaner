// components/onboarding/steps/CleanerStep4.jsx
"use client";

const CleanerStep4 = ({ formData, errors, onUpdate }) => {
  const suggestedRates = {
    beginner: { min: 15, max: 20 },
    intermediate: { min: 20, max: 30 },
    expert: { min: 30, max: 50 }
  };

  const getExpertiseLevel = () => {
    const exp = formData.years_of_experience;
    if (exp === 'Less than 1' || exp === '1-2') return 'beginner';
    if (exp === '3-5' || exp === '5-10') return 'intermediate';
    return 'expert';
  };

  const level = getExpertiseLevel();
  const suggested = suggestedRates[level];

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Set Your Rates</h2>
        <p>Choose competitive pricing for your services</p>
      </div>

      <div className="form-content">
        {/* Hourly Rate */}
        <div className="pricing-section">
          <label className="form-label">
            Hourly Rate <span className="required">*</span>
          </label>
          
          <div className="rate-suggestion">
            <div className="suggestion-icon">💡</div>
            <div className="suggestion-content">
              <p className="suggestion-title">Suggested rate for your experience:</p>
              <p className="suggestion-range">${suggested.min} - ${suggested.max} per hour</p>
              <p className="suggestion-note">Based on {formData.years_of_experience || '0'} years of experience</p>
            </div>
          </div>

          <div className="rate-input-wrapper">
            <span className="currency">£</span>
            <input
              type="number"
              value={formData.hourly_rate || ''}
              onChange={(e) => onUpdate('hourly_rate', e.target.value)}
              className="rate-input"
              placeholder="25"
              min="10"
              max="100"
            />
            <span className="rate-suffix">per hour</span>
          </div>
          {errors.hourly_rate && <span className="error-message">{errors.hourly_rate}</span>}
        </div>

        {/* Minimum Hours */}
        <div className="form-group">
          <label className="form-label">
            Minimum Booking Hours
          </label>
          <div className="hours-options">
            {[1, 2, 3, 4].map(hours => (
              <button
                key={hours}
                type="button"
                onClick={() => onUpdate('minimum_hours', hours)}
                className={`hour-btn ${formData.minimum_hours === hours ? 'active' : ''}`}
              >
                {hours} {hours === 1 ? 'hour' : 'hours'}
              </button>
            ))}
          </div>
        </div>

        {/* Travel Fee */}
        <div className="form-group">
          <label className="form-label">
            Travel Fee (Optional)
          </label>
          <div className="travel-options">
            <button
              type="button"
              onClick={() => onUpdate('travel_fee_type', 'none')}
              className={`travel-btn ${!formData.travel_fee_type || formData.travel_fee_type === 'none' ? 'active' : ''}`}
            >
              No travel fee
            </button>
            <button
              type="button"
              onClick={() => onUpdate('travel_fee_type', 'flat')}
              className={`travel-btn ${formData.travel_fee_type === 'flat' ? 'active' : ''}`}
            >
              Flat fee
            </button>
            <button
              type="button"
              onClick={() => onUpdate('travel_fee_type', 'distance')}
              className={`travel-btn ${formData.travel_fee_type === 'distance' ? 'active' : ''}`}
            >
              Based on distance
            </button>
          </div>

          {formData.travel_fee_type === 'flat' && (
            <div className="travel-fee-input">
              <span className="currency">£</span>
              <input
                type="number"
                value={formData.travel_fee || ''}
                onChange={(e) => onUpdate('travel_fee', e.target.value)}
                className="fee-input"
                placeholder="10"
                min="0"
              />
            </div>
          )}

          {formData.travel_fee_type === 'distance' && (
            <div className="distance-fee-input">
              <input
                type="text"
                value={formData.travel_fee_details || ''}
                onChange={(e) => onUpdate('travel_fee_details', e.target.value)}
                className="form-input"
                placeholder="e.g., £5 for 5-10 miles, £10 for 10+ miles"
              />
            </div>
          )}
        </div>

        {/* Special Rates */}
        <div className="form-group">
          <label className="form-label">
            Special Service Rates (Optional)
          </label>
          <div className="special-rates">
            <div className="rate-item">
              <span className="rate-label">Deep Cleaning</span>
              <div className="rate-input-small">
                <span className="currency">£</span>
                <input
                  type="number"
                  value={formData.deep_cleaning_rate || ''}
                  onChange={(e) => onUpdate('deep_cleaning_rate', e.target.value)}
                  className="rate-input-small"
                  placeholder="35"
                />
                <span className="rate-suffix">/hr</span>
              </div>
            </div>
            <div className="rate-item">
              <span className="rate-label">Move In/Out</span>
              <div className="rate-input-small">
                <span className="currency">£</span>
                <input
                  type="number"
                  value={formData.move_cleaning_rate || ''}
                  onChange={(e) => onUpdate('move_cleaning_rate', e.target.value)}
                  className="rate-input-small"
                  placeholder="40"
                />
                <span className="rate-suffix">/hr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Calculator Preview */}
        <div className="pricing-preview">
          <h3>Your Earnings Preview</h3>
          <div className="earnings-grid">
            <div className="earning-item">
              <span className="earning-label">Per Day (8 hours)</span>
              <span className="earning-amount">${(formData.hourly_rate || 25) * 8}</span>
            </div>
            <div className="earning-item">
              <span className="earning-label">Per Week (40 hours)</span>
              <span className="earning-amount">${(formData.hourly_rate || 25) * 40}</span>
            </div>
            <div className="earning-item">
              <span className="earning-label">Per Month (160 hours)</span>
              <span className="earning-amount highlight">${(formData.hourly_rate || 25) * 160}</span>
            </div>
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

        .pricing-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 0px !important;
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

        .rate-suggestion {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: linear-gradient(135deg, #f0f9f7 0%, #e8f5f3 100%);
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .suggestion-icon {
          font-size: 24px;
        }

        .suggestion-title {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .suggestion-range {
          font-size: 20px;
          font-weight: 600;
          color: #4b9b97;
          margin-bottom: 4px;
        }

        .suggestion-note {
          font-size: 12px;
          color: #9ca3af;
        }

        .rate-input-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .currency {
          font-size: 24px;
          color: #6b7280;
        }

        .rate-input {
          width: 100px;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 24px;
          font-weight: 600;
          text-align: center;
          outline: none;
        }

        .rate-input:focus {
          border-color: #4b9b97;
        }

        .rate-suffix {
          font-size: 16px;
          color: #6b7280;
        }

        .hours-options {
          display: flex;
          gap: 12px;
        }

        .hour-btn {
          padding: 10px 20px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          color: #6b7280;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .hour-btn:hover {
          border-color: #4b9b97;
        }

        .hour-btn.active {
          background: #4b9b97;
          color: white;
          border-color: #4b9b97;
        }

        .travel-options {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .travel-btn {
          flex: 1;
          padding: 10px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          color: #6b7280;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .travel-btn:hover {
          border-color: #4b9b97;
        }

        .travel-btn.active {
          background: #4b9b97;
          color: white;
          border-color: #4b9b97;
        }

        .travel-fee-input, .fee-input {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .fee-input {
          width: 100px;
          padding: 10px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          outline: none;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          outline: none;
        }

        .form-input:focus {
          border-color: #4b9b97;
        }

        .special-rates {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .rate-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .rate-label {
          font-size: 15px;
          color: #374151;
        }

        .rate-input-small {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .rate-input-small input {
          width: 60px;
          padding: 8px;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          text-align: center;
          outline: none;
        }

        .pricing-preview {
          padding: 24px;
          background: #f9fafb;
          border-radius: 12px;
        }

        .pricing-preview h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 16px;
        }

        .earnings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }

        .earning-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .earning-label {
          font-size: 13px;
          color: #6b7280;
        }

        .earning-amount {
          font-size: 24px;
          font-weight: 600;
          color: #374151;
        }

        .earning-amount.highlight {
          color: #4b9b97;
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

export default CleanerStep4;