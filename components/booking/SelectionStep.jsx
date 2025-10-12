"use client";

const SelectionStep = ({ onSelectMode, jobsCount }) => {
  return (
    <>
      <style jsx>{`
        .selection-container {
          max-width: 900px;
          margin: 0 auto;
        }
        
        .selection-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .selection-title {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 15px;
        }
        
        .selection-subtitle {
          font-size: 16px;
          color: #6b7280;
        }
        
        .selection-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }
        
        .selection-card {
          background: white;
          border-radius: 20px;
          padding: 40px 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          text-align: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 3px solid transparent;
          position: relative;
          overflow: hidden;
        }
        
        .selection-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #4C9A99 0%, #2d5f5f 100%);
          transform: translateY(-100%);
          transition: transform 0.3s ease;
        }
        
        .selection-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(76, 154, 153, 0.2);
          border-color: #4C9A99;
        }
        
        .selection-card:hover::before {
          transform: translateY(0);
        }
        
        .selection-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 25px;
          background: linear-gradient(135deg, rgba(76, 154, 153, 0.1) 0%, rgba(45, 95, 95, 0.1) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .selection-card:hover .selection-icon {
          background: linear-gradient(135deg, #4C9A99 0%, #2d5f5f 100%);
        }
        
        .selection-icon i {
          font-size: 36px;
          color: #4C9A99;
          transition: color 0.3s ease;
        }
        
        .selection-card:hover .selection-icon i {
          color: white;
        }
        
        .selection-card-title {
          font-size: 22px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 15px;
        }
        
        .selection-card-description {
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 25px;
        }
        
        .selection-button {
          background: linear-gradient(135deg, #4C9A99 0%, #2d5f5f 100%);
          color: white;
          padding: 12px 30px;
          border-radius: 10px;
          border: none;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        
        .selection-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(76, 154, 153, 0.3);
        }
        
        .jobs-count-badge {
          background: rgba(76, 154, 153, 0.1);
          color: #4C9A99;
          padding: 4px 10px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 600;
          margin-left: 10px;
        }
        
        .no-jobs-badge {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
          padding: 4px 10px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 600;
          margin-left: 10px;
        }
        
        @media (max-width: 768px) {
          .selection-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      
      <div className="selection-container">
        <div className="selection-header">
          <h2 className="selection-title">How would you like to proceed?</h2>
          <p className="selection-subtitle">Choose your preferred booking method</p>
        </div>
        
        <div className="selection-grid">
          <div className="selection-card" onClick={() => onSelectMode("existing")}>
            <div className="selection-icon">
              <i className="la la-clipboard-list"></i>
            </div>
            <h3 className="selection-card-title">
              Select Existing Job
              {jobsCount > 0 ? (
                <span className="jobs-count-badge">{jobsCount} available</span>
              ) : (
                <span className="no-jobs-badge">No open jobs</span>
              )}
            </h3>
            <p className="selection-card-description">
              {jobsCount > 0 
                ? "Choose from your open jobs and assign this cleaner to work on them"
                : "You don't have any open jobs at the moment"}
            </p>
            <button className="selection-button">
              <i className="la la-arrow-right"></i>
              {jobsCount > 0 ? "Select Existing Job" : "View Anyway"}
            </button>
          </div>
          
          <div className="selection-card" onClick={() => onSelectMode("create")}>
            <div className="selection-icon">
              <i className="la la-plus-circle"></i>
            </div>
            <h3 className="selection-card-title">Create New Job</h3>
            <p className="selection-card-description">
              Post a new cleaning job and directly assign this cleaner for immediate booking
            </p>
            <button className="selection-button">
              <i className="la la-arrow-right"></i>
              Create New Job
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectionStep;