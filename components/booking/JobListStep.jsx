"use client";

import { useState } from "react";

const JobListStep = ({ jobs = [], loading, onSelectJob, onBack, onCreateNew }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(null);
  
  // Filter jobs to only show open ones and apply search
  const filteredJobs = jobs.filter(job => {
    // Only show open jobs
    const isOpen = job?.status?.toLowerCase() === 'o' || 
                   job?.status?.toLowerCase() === 'open' || 
                   job?.status?.toLowerCase() === 'pending';
    
    // Apply search filter
    const matchesSearch = job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job?.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return isOpen && matchesSearch;
  });
  
  const handleSelectJob = (job) => {
    setSelectedJobId(job.job_id || job.id);
    setTimeout(() => onSelectJob(job), 300);
  };
  
  const statusLabel = (code) => {
    const labels = { 
      o: "Open", 
      open: "Open",
      p: "Pending", 
      pending: "Pending",
      t: "Taken",
      taken: "Taken", 
      ip: "In Progress",
      "in progress": "In Progress", 
      c: "Completed",
      completed: "Completed"
    };
    return labels[String(code).toLowerCase()] || code || "Open";
  };
  
  const statusClass = (code) => {
    const status = String(code).toLowerCase();
    if (status === 'o' || status === 'open') return 'status-open';
    if (status === 'p' || status === 'pending') return 'status-pending';
    if (status === 't' || status === 'taken') return 'status-taken';
    if (status === 'ip' || status === 'in progress') return 'status-progress';
    if (status === 'c' || status === 'completed') return 'status-completed';
    return 'status-open';
  };
  
  return (
    <>
      <style jsx>{`
        .job-list-container {
          max-width: 1000px;
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
        
        .jobs-count-badge {
          display: inline-block;
          background: linear-gradient(135deg, #4C9A99 0%, #2d5f5f 100%);
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 14px;
          margin-left: 10px;
        }
        
        .search-bar {
          background: white;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 30px;
        }
        
        .search-input-wrapper {
          position: relative;
        }
        
        .search-input {
          width: 100%;
          padding: 15px 20px 15px 50px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #4C9A99;
          box-shadow: 0 0 0 3px rgba(76, 154, 153, 0.1);
        }
        
        .search-icon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 20px;
        }
        
        .jobs-grid {
          display: grid;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .job-card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          border: 2px solid transparent;
          overflow: hidden;
        }
        
        .job-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #4C9A99 0%, #2d5f5f 100%);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }
        
        .job-card:hover {
          transform: translateX(10px);
          box-shadow: 0 10px 30px rgba(76, 154, 153, 0.15);
          border-color: #4C9A99;
        }
        
        .job-card:hover::before {
          transform: translateX(0);
        }
        
        .job-card.selected {
          border-color: #4C9A99;
          background: linear-gradient(135deg, rgba(76, 154, 153, 0.05) 0%, rgba(45, 95, 95, 0.05) 100%);
        }
        
        .job-card-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 15px;
        }
        
        .job-title {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }
        
        .job-status {
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .job-status.status-open {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
        }
        
        .job-status.status-pending {
          background: linear-gradient(135deg, #fed7aa 0%, #fbbf24 100%);
          color: #92400e;
        }
        
        .job-status.status-taken {
          background: linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%);
          color: #1e40af;
        }
        
        .job-status.status-progress {
          background: linear-gradient(135deg, #e9d5ff 0%, #c084fc 100%);
          color: #6b21a8;
        }
        
        .job-status.status-completed {
          background: linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 100%);
          color: #3730a3;
        }
        
        .job-description {
          color: #6b7280;
          line-height: 1.5;
          margin-bottom: 15px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .job-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .job-meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          font-size: 14px;
        }
        
        .job-meta-item i {
          color: #4C9A99;
          font-size: 16px;
        }
        
        .no-jobs {
          background: white;
          border-radius: 15px;
          padding: 60px 30px;
          text-align: center;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
        }
        
        .no-jobs-icon {
          width: 100px;
          height: 100px;
          margin: 0 auto 25px;
          background: linear-gradient(135deg, rgba(76, 154, 153, 0.1) 0%, rgba(45, 95, 95, 0.1) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .no-jobs-icon i {
          font-size: 48px;
          color: #4C9A99;
        }
        
        .no-jobs-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 10px;
        }
        
        .no-jobs-text {
          color: #6b7280;
          margin-bottom: 25px;
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
          background: linear-gradient(135deg, #4C9A99 0%, #2d5f5f 100%);
          color: white;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(76, 154, 153, 0.3);
        }
        
        .loading-spinner {
          text-align: center;
          padding: 60px;
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e5e7eb;
          border-top-color: #4C9A99;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <div className="job-list-container">
        <div className="step-header">
          <h2 className="step-title">
            Select an Open Job
            {filteredJobs.length > 0 && (
              <span className="jobs-count-badge">{filteredJobs.length} available</span>
            )}
          </h2>
          <p className="step-subtitle">Choose from your open jobs to assign this cleaner</p>
        </div>
        
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your jobs...</p>
          </div>
        ) : (
          <>
            {jobs.length > 0 && (
              <div className="search-bar">
                <div className="search-input-wrapper">
                  <i className="la la-search search-icon"></i>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search open jobs by title, location, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            {filteredJobs.length > 0 ? (
              <div className="jobs-grid">
                {filteredJobs.map((job) => {
                  const jobId = job.job_id || job.id;
                  const jobDate = job.date ? new Date(job.date).toLocaleDateString('en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }) : "Flexible";
                  
                  return (
                    <div
                      key={jobId}
                      className={`job-card ${selectedJobId === jobId ? 'selected' : ''}`}
                      onClick={() => handleSelectJob(job)}
                    >
                      <div className="job-card-header">
                        <div>
                          <h3 className="job-title">{job.title}</h3>
                        </div>
                        <span className={`job-status ${statusClass(job.status)}`}>
                          {statusLabel(job.status)}
                        </span>
                      </div>
                      
                      {job.description && (
                        <p className="job-description">{job.description}</p>
                      )}
                      
                      <div className="job-meta">
                        <div className="job-meta-item">
                          <i className="la la-map-marker"></i>
                          <span>{job.location || "Not specified"}</span>
                        </div>
                        <div className="job-meta-item">
                          <i className="la la-calendar"></i>
                          <span>{jobDate}</span>
                        </div>
                        {job.time && (
                          <div className="job-meta-item">
                            <i className="la la-clock"></i>
                            <span>{job.time}</span>
                          </div>
                        )}
                        {job.hourly_rate && (
                          <div className="job-meta-item">
                            <i className="la la-pound-sign"></i>
                            <span>£{job.hourly_rate}/hr</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : jobs.length > 0 ? (
              <div className="no-jobs">
                <div className="no-jobs-icon">
                  <i className="la la-search"></i>
                </div>
                <h3 className="no-jobs-title">No open jobs found</h3>
                <p className="no-jobs-text">
                  {searchTerm 
                    ? "Try adjusting your search terms" 
                    : "All your jobs are either taken or completed. Create a new job to book this cleaner."}
                </p>
                <button className="btn btn-primary" onClick={onCreateNew}>
                  <i className="la la-plus"></i>
                  Create New Job
                </button>
              </div>
            ) : (
              <div className="no-jobs">
                <div className="no-jobs-icon">
                  <i className="la la-clipboard-list"></i>
                </div>
                <h3 className="no-jobs-title">No jobs posted yet</h3>
                <p className="no-jobs-text">
                  You haven't posted any jobs yet. Create a new job to book this cleaner.
                </p>
                <button className="btn btn-primary" onClick={onCreateNew}>
                  <i className="la la-plus"></i>
                  Create New Job
                </button>
              </div>
            )}
            
            <div className="action-buttons">
              <button className="btn btn-secondary" onClick={onBack}>
                <i className="la la-arrow-left"></i>
                Back
              </button>
              {filteredJobs.length > 0 && (
                <button className="btn btn-primary" onClick={onCreateNew}>
                  <i className="la la-plus"></i>
                  Create New Job Instead
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default JobListStep;