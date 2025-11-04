'use client';

const BookingDetailsModal = ({ booking, onClose, onRefresh }) => {
  if (!booking) return null;

  const getStatusBadge = (status) => {
    const statusMap = {
      'p': { label: 'Pending', class: 'status-pending' },
      'cf': { label: 'Confirmed', class: 'status-confirmed' },
      'cp': { label: 'Completed', class: 'status-completed' },
      'r': { label: 'Rejected', class: 'status-rejected' },
    };
    const config = statusMap[status] || { label: status, class: 'status-default' };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '£0.00';
    return `£${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div>
              <h2>Booking Details</h2>
              <p className="booking-id">ID: #{booking.id}</p>
            </div>
            <button className="close-btn" onClick={onClose}>
              <span className="la la-times"></span>
            </button>
          </div>

          <div className="modal-body">
            {/* Status Section */}
            <div className="section">
              <h3 className="section-title">
                <span className="la la-info-circle"></span>
                Status Information
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Current Status</label>
                  <div>{getStatusBadge(booking.status)}</div>
                </div>
                <div className="info-item">
                  <label>Cleaner Confirmed</label>
                  <div>
                    {booking.cleaner_confirmed ? (
                      <span className="confirmed-badge">
                        <span className="la la-check-circle"></span> Yes
                      </span>
                    ) : (
                      <span className="unconfirmed-badge">
                        <span className="la la-clock"></span> No
                      </span>
                    )}
                  </div>
                </div>
                <div className="info-item">
                  <label>Payment Status</label>
                  <div>
                    {booking.paid_at ? (
                      <span className="paid-badge">
                        <span className="la la-check"></span> Paid
                      </span>
                    ) : (
                      <span className="unpaid-badge">Unpaid</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Job Information */}
            <div className="section">
              <h3 className="section-title">
                <span className="la la-briefcase"></span>
                Job Information
              </h3>
              <div className="info-grid">
                <div className="info-item full-width">
                  <label>Job Title</label>
                  <div className="value-text">{booking.job_title || 'N/A'}</div>
                </div>
                <div className="info-item full-width">
                  <label>Location</label>
                  <div className="value-text">
                    <span className="la la-map-marker"></span>
                    {booking.job_location || 'N/A'}
                  </div>
                </div>
                {booking.job_description && (
                  <div className="info-item full-width">
                    <label>Description</label>
                    <div className="description-text">{booking.job_description}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Information */}
            <div className="section">
              <h3 className="section-title">
                <span className="la la-pound-sign"></span>
                Financial Details
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Booking Amount</label>
                  <div className="amount-text">{formatCurrency(booking.booking_amount)}</div>
                </div>
                {booking.payment_reference && (
                  <div className="info-item full-width">
                    <label>Payment Reference</label>
                    <div className="value-text">{booking.payment_reference}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Cleaner Information */}
            <div className="section">
              <h3 className="section-title">
                <span className="la la-user"></span>
                Cleaner Information
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Name</label>
                  <div className="value-text">{booking.cleaner_name || 'N/A'}</div>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <div className="value-text">{booking.cleaner_email || 'N/A'}</div>
                </div>
                {booking.cleaner_phone && (
                  <div className="info-item">
                    <label>Phone</label>
                    <div className="value-text">{booking.cleaner_phone}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Employer Information */}
            <div className="section">
              <h3 className="section-title">
                <span className="la la-building"></span>
                Employer Information
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Name</label>
                  <div className="value-text">{booking.employer_name || 'N/A'}</div>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <div className="value-text">{booking.employer_email || 'N/A'}</div>
                </div>
                {booking.employer_phone && (
                  <div className="info-item">
                    <label>Phone</label>
                    <div className="value-text">{booking.employer_phone}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="section">
              <h3 className="section-title">
                <span className="la la-clock"></span>
                Timeline
              </h3>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker active"></div>
                  <div className="timeline-content">
                    <strong>Booking Created</strong>
                    <span>{formatDate(booking.created_at)}</span>
                  </div>
                </div>
                {booking.cleaner_confirmed && (
                  <div className="timeline-item">
                    <div className="timeline-marker active"></div>
                    <div className="timeline-content">
                      <strong>Cleaner Confirmed</strong>
                      <span>{formatDate(booking.confirmed_at)}</span>
                    </div>
                  </div>
                )}
                {booking.paid_at && (
                  <div className="timeline-item">
                    <div className="timeline-marker active"></div>
                    <div className="timeline-content">
                      <strong>Payment Received</strong>
                      <span>{formatDate(booking.paid_at)}</span>
                    </div>
                  </div>
                )}
                {booking.completed_at && (
                  <div className="timeline-item">
                    <div className="timeline-marker active"></div>
                    <div className="timeline-content">
                      <strong>Booking Completed</strong>
                      <span>{formatDate(booking.completed_at)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            {(booking.cleaner_review || booking.employer_review) && (
              <div className="section">
                <h3 className="section-title">
                  <span className="la la-star"></span>
                  Reviews
                </h3>
                <div className="reviews-grid">
                  {booking.cleaner_review && (
                    <div className="review-card">
                      <div className="review-header">
                        <strong>Cleaner Review</strong>
                        <div className="rating">
                          {'★'.repeat(booking.cleaner_review.rating)}
                          {'☆'.repeat(5 - booking.cleaner_review.rating)}
                        </div>
                      </div>
                      {booking.cleaner_review.comment && (
                        <p className="review-comment">{booking.cleaner_review.comment}</p>
                      )}
                    </div>
                  )}
                  {booking.employer_review && (
                    <div className="review-card">
                      <div className="review-header">
                        <strong>Employer Review</strong>
                        <div className="rating">
                          {'★'.repeat(booking.employer_review.rating)}
                          {'☆'.repeat(5 - booking.employer_review.rating)}
                        </div>
                      </div>
                      {booking.employer_review.comment && (
                        <p className="review-comment">{booking.employer_review.comment}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn-close" onClick={onClose}>
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
          overflow-y: auto;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          margin: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 24px 28px;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          background: white;
          border-radius: 16px 16px 0 0;
          z-index: 10;
        }

        .modal-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .booking-id {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .close-btn {
          width: 36px;
          height: 36px;
          border: none;
          background: #f3f4f6;
          border-radius: 8px;
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: all 0.2s;
          font-size: 20px;
          color: #6b7280;
        }

        .close-btn:hover {
          background: #e5e7eb;
          color: #1f2937;
        }

        .modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px 28px;
        }

        .section {
          margin-bottom: 28px;
        }

        .section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-title .la {
          font-size: 18px;
          color: #8b5cf6;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .info-item.full-width {
          grid-column: 1 / -1;
        }

        .info-item label {
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .value-text {
          font-size: 14px;
          color: #1f2937;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .description-text {
          font-size: 14px;
          color: #4b5563;
          line-height: 1.6;
        }

        .amount-text {
          font-size: 20px;
          font-weight: 700;
          color: #059669;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-confirmed {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-completed {
          background: #d1fae5;
          color: #065f46;
        }

        .status-rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-default {
          background: #f3f4f6;
          color: #6b7280;
        }

        .confirmed-badge,
        .unconfirmed-badge,
        .paid-badge,
        .unpaid-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 8px;
        }

        .confirmed-badge,
        .paid-badge {
          background: #d1fae5;
          color: #065f46;
        }

        .unconfirmed-badge,
        .unpaid-badge {
          background: #fef3c7;
          color: #92400e;
        }

        .timeline {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .timeline-item {
          display: flex;
          gap: 16px;
          position: relative;
        }

        .timeline-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 7px;
          top: 28px;
          bottom: -16px;
          width: 2px;
          background: #e5e7eb;
        }

        .timeline-marker {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 3px solid #e5e7eb;
          background: white;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .timeline-marker.active {
          border-color: #8b5cf6;
          background: #8b5cf6;
        }

        .timeline-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .timeline-content strong {
          font-size: 14px;
          color: #1f2937;
          font-weight: 600;
        }

        .timeline-content span {
          font-size: 13px;
          color: #6b7280;
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }

        .review-card {
          padding: 16px;
          background: #f9fafb;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .review-header strong {
          font-size: 14px;
          color: #1f2937;
        }

        .rating {
          color: #fbbf24;
          font-size: 16px;
        }

        .review-comment {
          font-size: 14px;
          color: #4b5563;
          line-height: 1.6;
          margin: 0;
        }

        .modal-footer {
          padding: 20px 28px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          position: sticky;
          bottom: 0;
          background: white;
          border-radius: 0 0 16px 16px;
        }

        .btn-close {
          height: 44px;
          padding: 0 24px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-close:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        @media (max-width: 768px) {
          .modal-content {
            max-width: 100%;
            max-height: 100vh;
            border-radius: 0;
          }

          .modal-header,
          .modal-body,
          .modal-footer {
            padding-left: 20px;
            padding-right: 20px;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .reviews-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default BookingDetailsModal;
