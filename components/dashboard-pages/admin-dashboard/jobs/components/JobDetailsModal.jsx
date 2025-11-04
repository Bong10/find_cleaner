'use client';

const JobDetailsModal = ({ job, onClose }) => {
  if (!job) return null;

  const getStatusBadge = (status) => {
    const statusMap = {
      open: { label: 'Open', class: 'status-open' },
      in_progress: { label: 'In Progress', class: 'status-progress' },
      completed: { label: 'Completed', class: 'status-completed' },
      cancelled: { label: 'Cancelled', class: 'status-cancelled' },
      closed: { label: 'Closed', class: 'status-closed' },
    };
    const config = statusMap[status] || { label: status, class: 'status-default' };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Job Details</h3>
            <button className="close-btn" onClick={onClose}>
              <span className="la la-times"></span>
            </button>
          </div>

          <div className="modal-body">
            <div className="details-section">
              <div className="section-header">
                <h4>Job Information</h4>
                {getStatusBadge(job.status)}
              </div>
              
              <div className="details-grid">
                <div className="detail-item">
                  <label>Job ID:</label>
                  <span>#{job.id}</span>
                </div>
                <div className="detail-item">
                  <label>Title:</label>
                  <span className="highlight">{job.title}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Description:</label>
                  <span>{job.description || 'No description provided'}</span>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h4>Employer Details</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Employer:</label>
                  <span>{job.employer_name || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{job.employer_email || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Phone:</label>
                  <span>{job.employer_phone || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h4>Job Specifics</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Location:</label>
                  <span>{job.location || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Date:</label>
                  <span>{job.date ? new Date(job.date).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Time:</label>
                  <span>{job.time || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Hourly Rate:</label>
                  <span className="highlight">${job.hourly_rate || '0'}/hour</span>
                </div>
                <div className="detail-item">
                  <label>Hours Required:</label>
                  <span>{job.hours_required || 0} hours</span>
                </div>
                <div className="detail-item">
                  <label>Total Budget:</label>
                  <span className="highlight">${(job.hourly_rate * job.hours_required) || 0}</span>
                </div>
              </div>
            </div>

            {job.services_display && job.services_display.length > 0 && (
              <div className="details-section">
                <h4>Services Requested</h4>
                <div className="services-tags">
                  {job.services_display.map((service, index) => (
                    <span key={index} className="service-tag">
                      <span className="la la-check-circle"></span>
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="details-section">
              <h4>Applications</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Total Applications:</label>
                  <span className="count-badge">{job.applications_count || 0}</span>
                </div>
                <div className="detail-item">
                  <label>Archived:</label>
                  <span>{job.is_archived ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h4>Timestamps</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Created:</label>
                  <span>{job.created_at ? new Date(job.created_at).toLocaleString() : 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Last Updated:</label>
                  <span>{job.updated_at ? new Date(job.updated_at).toLocaleString() : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
        }

        .modal-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .close-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: #f3f4f6;
          border-radius: 6px;
          cursor: pointer;
          display: grid;
          place-items: center;
          font-size: 18px;
          color: #6b7280;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #e5e7eb;
        }

        .modal-body {
          padding: 24px;
        }

        .details-section {
          margin-bottom: 28px;
        }

        .details-section:last-child {
          margin-bottom: 0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-header h4 {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .details-section h4 {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 16px 0;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .detail-item.full-width {
          grid-column: 1 / -1;
        }

        .detail-item label {
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-item span {
          font-size: 14px;
          color: #374151;
        }

        .detail-item span.highlight {
          font-weight: 600;
          color: #1f2937;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-open {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-progress {
          background: #fef3c7;
          color: #92400e;
        }

        .status-completed {
          background: #d1fae5;
          color: #065f46;
        }

        .status-cancelled {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-closed {
          background: #e5e7eb;
          color: #4b5563;
        }

        .status-default {
          background: #f3f4f6;
          color: #6b7280;
        }

        .services-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .service-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #0369a1;
        }

        .service-tag .la {
          font-size: 14px;
        }

        .count-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 32px;
          height: 32px;
          padding: 0 10px;
          background: #f3f4f6;
          border-radius: 6px;
          font-weight: 600;
          color: #374151;
        }

        .modal-footer {
          padding: 20px 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          position: sticky;
          bottom: 0;
          background: white;
        }

        .btn-secondary {
          padding: 10px 24px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          background: #f3f4f6;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        @media (max-width: 768px) {
          .details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default JobDetailsModal;
