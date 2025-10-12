"use client";

const ConfirmationStep = ({ 
  cleaner, 
  cleanerId,
  selectedJob, 
  jobForm, 
  bookingMode, 
  isSubmitting, 
  onConfirm, 
  onBack 
}) => {
  const getCleanerName = () => {
    if (!cleaner) return "Cleaner";
    if (cleaner.name) return cleaner.name;
    
    const userData = cleaner.user || cleaner;
    if (userData.first_name && userData.last_name) {
      return `${userData.first_name} ${userData.last_name}`;
    }
    return userData.name || userData.email?.split("@")[0] || "Cleaner";
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <>
      <style jsx>{`
        .confirmation-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .confirmation-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .confirmation-title {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 15px;
        }
        
        .confirmation-subtitle {
          font-size: 16px;
          color: #6b7280;
        }
        
        .summary-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          margin-bottom: 30px;
        }
        
        .summary-section {
          margin-bottom: 30px;
        }
        
        .summary-section:last-child {
          margin-bottom: 0;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .summary-item {
          display: flex;
          align-items: start;
          gap: 12px;
        }
        
        .summary-icon {
          color: #4C9A99;
          font-size: 20px;
          margin-top: 2px;
        }
        
        .summary-content {
          flex: 1;
        }
        
        .summary-label {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        
        .summary-value {
          font-size: 15px;
          color: #1f2937;
          font-weight: 600;
        }
        
        .highlight-box {
          background: linear-gradient(135deg, rgba(76, 154, 153, 0.05) 0%, rgba(45, 95, 95, 0.05) 100%);
          border: 2px solid #4C9A99;
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 30px;
        }
        
        .total-amount {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 20px;
          font-weight: 700;
        }
        
        .total-label {
          color: #374151;
        }
        
        .total-value {
          color: #4C9A99;
          font-size: 28px;
        }
        
        .info-alert {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(29, 78, 216, 0.05) 100%);
          border-left: 4px solid #3b82f6;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 30px;
        }
        
        .info-alert-title {
          font-size: 16px;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .info-alert-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .info-alert-list li {
          color: #374151;
          font-size: 14px;
          margin-bottom: 8px;
          padding-left: 24px;
          position: relative;
        }
        
        .info-alert-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #3b82f6;
          font-weight: 700;
        }
        
        .action-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
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
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .btn-secondary {
          background: #f3f4f6;
          color: #4b5563;
        }
        
        .btn-secondary:hover:not(:disabled) {
          background: #e5e7eb;
        }
        
        .btn-success {
          background: linear-gradient(135deg, #4C9A99 0%, #2d5f5f 100%);
          color: white;
        }
        
        .btn-success:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(76, 154, 153, 0.3);
        }
        
        .spinner {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <div className="confirmation-container">
        <div className="confirmation-header">
          <h2 className="confirmation-title">Confirm Your Booking</h2>
          <p className="confirmation-subtitle">Review all details before confirming</p>
        </div>
        
        <div className="summary-card">
          <div className="summary-section">
            <h3 className="section-title">Cleaner Information</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <i className="la la-user summary-icon"></i>
                <div className="summary-content">
                  <div className="summary-label">Cleaner Name</div>
                  <div className="summary-value">{getCleanerName()}</div>
                </div>
              </div>
              
              <div className="summary-item">
                <i className="la la-pound-sign summary-icon"></i>
                <div className="summary-content">
                  <div className="summary-label">Hourly Rate</div>
                  <div className="summary-value">£{cleaner?.hourly_rate || 20}/hour</div>
                </div>
              </div>
              
              {cleaner?.averageRating && (
                <div className="summary-item">
                  <i className="la la-star summary-icon"></i>
                  <div className="summary-content">
                    <div className="summary-label">Rating</div>
                    <div className="summary-value">⭐ {cleaner.averageRating}</div>
                  </div>
                </div>
              )}
              
              {(cleaner?.isVerified || cleaner?.is_verified) && (
                <div className="summary-item">
                  <i className="la la-check-circle summary-icon"></i>
                  <div className="summary-content">
                    <div className="summary-label">Status</div>
                    <div className="summary-value">Verified</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="summary-section">
            <h3 className="section-title">Job Details</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <i className="la la-briefcase summary-icon"></i>
                <div className="summary-content">
                  <div className="summary-label">Job Title</div>
                  <div className="summary-value">
                    {bookingMode === "existing" ? selectedJob?.title : jobForm?.title}
                  </div>
                </div>
              </div>
              
              <div className="summary-item">
                <i className="la la-calendar summary-icon"></i>
                <div className="summary-content">
                  <div className="summary-label">Date</div>
                  <div className="summary-value">
                    {formatDate(bookingMode === "existing" ? selectedJob?.date : jobForm?.date)}
                  </div>
                </div>
              </div>
              
              <div className="summary-item">
                <i className="la la-clock summary-icon"></i>
                <div className="summary-content">
                  <div className="summary-label">Time</div>
                  <div className="summary-value">
                    {bookingMode === "existing" ? selectedJob?.time : jobForm?.time || "Not specified"}
                  </div>
                </div>
              </div>
              
              <div className="summary-item">
                <i className="la la-map-marker summary-icon"></i>
                <div className="summary-content">
                  <div className="summary-label">Location</div>
                  <div className="summary-value">
                    {bookingMode === "existing" ? selectedJob?.location : jobForm?.location}
                  </div>
                </div>
              </div>
            </div>
            
            {bookingMode === "create" && jobForm?.description && (
              <div className="summary-item" style={{ marginTop: '20px' }}>
                <i className="la la-file-text summary-icon"></i>
                <div className="summary-content">
                  <div className="summary-label">Description</div>
                  <div className="summary-value" style={{ fontWeight: 400, lineHeight: 1.5 }}>
                    {jobForm.description}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {(bookingMode === "create" && jobForm?.hours_required) && (
            <div className="highlight-box">
              <div className="total-amount">
                <span className="total-label">Estimated Total:</span>
                <span className="total-value">
                  £{((cleaner?.hourly_rate || jobForm?.hourly_rate || 20) * (jobForm?.hours_required || 1)).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="info-alert">
          <div className="info-alert-title">
            <i className="la la-info-circle"></i>
            What happens next?
          </div>
          <ul className="info-alert-list">
            <li>The cleaner will be notified of your booking request immediately</li>
            <li>They will review the job details and confirm their availability</li>
            <li>Once confirmed, you'll receive a notification and can start messaging</li>
            <li>Payment will be securely processed after the job is completed</li>
            <li>You'll have the opportunity to rate and review the service</li>
          </ul>
        </div>
        
        <div className="action-buttons">
          <button 
            className="btn btn-secondary" 
            onClick={onBack}
            disabled={isSubmitting}
          >
            <i className="la la-arrow-left"></i>
            Back
          </button>
          <button 
            className="btn btn-success" 
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="la la-spinner spinner"></i>
                Processing...
              </>
            ) : (
              <>
                <i className="la la-check"></i>
                Confirm Booking
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmationStep;