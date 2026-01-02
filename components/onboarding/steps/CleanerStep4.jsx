// components/onboarding/steps/CleanerStep4.jsx
"use client";

const CleanerStep4 = ({ formData, errors, onUpdate }) => {
  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Booking Requirements</h2>
        <p>Set your minimum booking hours</p>
      </div>

      <div className="form-content">
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
      `}</style>
    </div>
  );
};

export default CleanerStep4;