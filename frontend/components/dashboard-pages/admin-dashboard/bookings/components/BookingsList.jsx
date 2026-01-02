'use client';

const BookingsList = ({ bookings, loading, searchTerm, onView }) => {
  if (loading) {
    return (
      <>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading bookings...</p>
        </div>

        <style jsx>{`
          .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 100px 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .spinner {
            width: 48px;
            height: 48px;
            border: 4px solid #f3f4f6;
            border-top-color: #8b5cf6;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-bottom: 16px;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          .loading-state p {
            margin: 0;
            color: #6b7280;
            font-size: 15px;
            font-weight: 500;
          }
        `}</style>
      </>
    );
  }

  if (bookings.length === 0) {
    return (
      <>
        <div className="empty-state">
          <span className="la la-calendar-check"></span>
          <h3>No bookings found</h3>
          <p>{searchTerm ? 'Try adjusting your search criteria' : 'No bookings have been made yet'}</p>
        </div>

        <style jsx>{`
          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 100px 20px;
            text-align: center;
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .empty-state .la {
            font-size: 80px;
            color: #e5e7eb;
            margin-bottom: 20px;
          }

          .empty-state h3 {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 12px 0;
          }

          .empty-state p {
            font-size: 15px;
            color: #6b7280;
            margin: 0;
          }
        `}</style>
      </>
    );
  }

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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '£0';
    return `£${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Job</th>
              <th>Cleaner</th>
              <th>Employer</th>
              <th>Amount</th>
              <th>Booked Date</th>
              <th>Status</th>
              <th>Confirmed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>#{booking.id}</td>
                <td>
                  <div className="job-cell">
                    <strong>{booking.job_title || 'N/A'}</strong>
                    {booking.job_location && (
                      <small className="location-tag">
                        <span className="la la-map-marker"></span>
                        {booking.job_location}
                      </small>
                    )}
                  </div>
                </td>
                <td>
                  <div className="user-cell">
                    <strong>{booking.cleaner_name || 'N/A'}</strong>
                    {booking.cleaner_phone && (
                      <small>{booking.cleaner_phone}</small>
                    )}
                  </div>
                </td>
                <td>
                  <div className="user-cell">
                    <strong>{booking.employer_name || 'N/A'}</strong>
                    {booking.employer_phone && (
                      <small>{booking.employer_phone}</small>
                    )}
                  </div>
                </td>
                <td>
                  <strong className="amount">{formatCurrency(booking.booking_amount)}</strong>
                </td>
                <td>{formatDate(booking.created_at)}</td>
                <td>{getStatusBadge(booking.status)}</td>
                <td>
                  {booking.cleaner_confirmed ? (
                    <span className="confirmed-badge">
                      <span className="la la-check"></span> Yes
                    </span>
                  ) : (
                    <span className="unconfirmed-badge">
                      <span className="la la-clock"></span> No
                    </span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => onView(booking)}
                      title="View Details"
                    >
                      <span className="la la-eye"></span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .table-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table thead {
          background: #f9fafb;
        }

        .data-table th {
          padding: 16px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .data-table td {
          padding: 16px;
          border-top: 1px solid #f3f4f6;
          font-size: 14px;
          color: #374151;
        }

        .data-table tbody tr {
          transition: background 0.2s;
        }

        .data-table tbody tr:hover {
          background: #f9fafb;
        }

        .job-cell,
        .user-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .job-cell strong,
        .user-cell strong {
          color: #1f2937;
          font-weight: 600;
          font-size: 14px;
        }

        .job-cell small,
        .user-cell small {
          font-size: 12px;
          color: #6b7280;
        }

        .location-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #8b5cf6;
          background: #f3e8ff;
          padding: 2px 8px;
          border-radius: 6px;
          font-weight: 500;
          max-width: fit-content;
        }

        .location-tag .la {
          font-size: 12px;
        }

        .amount {
          color: #059669;
          font-weight: 700;
          font-size: 15px;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
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
        .unconfirmed-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 600;
        }

        .confirmed-badge {
          color: #059669;
        }

        .unconfirmed-badge {
          color: #d97706;
        }

        .confirmed-badge .la,
        .unconfirmed-badge .la {
          font-size: 14px;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-view {
          width: 36px;
          height: 36px;
          border: none;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: all 0.2s;
          font-size: 16px;
        }

        .btn-view:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        @media (max-width: 1024px) {
          .table-container {
            overflow-x: auto;
          }

          .data-table {
            min-width: 1000px;
          }
        }
      `}</style>
    </>
  );
};

export default BookingsList;
