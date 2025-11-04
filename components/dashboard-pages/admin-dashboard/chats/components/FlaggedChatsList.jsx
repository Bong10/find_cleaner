'use client';

const FlaggedChatsList = ({ flaggedChats, loading, searchTerm, onViewChat, onResolve }) => {
  if (loading) {
    return (
      <>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading flagged chats...</p>
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

  if (flaggedChats.length === 0) {
    return (
      <>
        <div className="empty-state">
          <span className="la la-flag"></span>
          <h3>No flagged chats found</h3>
          <p>{searchTerm ? 'Try adjusting your search criteria' : 'No reported content at this time'}</p>
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="table-container">
        <table className="flagged-table">
          <thead>
            <tr>
              <th>Flag ID</th>
              <th>Chat ID</th>
              <th>Flagged By</th>
              <th>Reason</th>
              <th>Flagged Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flaggedChats.map((flag) => (
              <tr key={flag.id} className={!flag.resolved ? 'unresolved' : ''}>
                <td>
                  <div className="flag-id">
                    <span className="la la-flag"></span>
                    #{flag.id}
                  </div>
                </td>
                <td>
                  <div className="chat-id">
                    <span className="la la-comments"></span>
                    #{flag.chat || 'N/A'}
                  </div>
                </td>
                <td>
                  <div className="flagged-by">
                    <span className="la la-user"></span>
                    <div className="flagged-by-info">
                      <strong>{flag.flagged_by_name || 'Unknown User'}</strong>
                      <small>User #{flag.flagged_by || 'N/A'}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="reason-cell">
                    <span className="reason-text">{flag.reason || 'No reason provided'}</span>
                  </div>
                </td>
                <td>
                  <div className="date-cell">
                    <span className="la la-calendar"></span>
                    {formatDate(flag.flagged_at || flag.created_at)}
                  </div>
                </td>
                <td>
                  {flag.resolved ? (
                    <span className="status-badge resolved">
                      <span className="la la-check-circle"></span>
                      Resolved
                    </span>
                  ) : (
                    <span className="status-badge unresolved">
                      <span className="la la-exclamation-triangle"></span>
                      Unresolved
                    </span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => onViewChat(flag)}
                      title="View Chat"
                    >
                      <span className="la la-eye"></span>
                      View
                    </button>
                    {!flag.resolved && (
                      <button
                        className="btn-resolve"
                        onClick={() => onResolve(flag)}
                        title="Resolve Flag"
                      >
                        <span className="la la-check"></span>
                        Resolve
                      </button>
                    )}
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
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .flagged-table {
          width: 100%;
          border-collapse: collapse;
        }

        .flagged-table thead {
          background: #f9fafb;
          border-bottom: 2px solid #e5e7eb;
        }

        .flagged-table th {
          padding: 16px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .flagged-table tbody tr {
          border-bottom: 1px solid #f3f4f6;
          transition: background-color 0.2s;
        }

        .flagged-table tbody tr.unresolved {
          background: #fef2f2;
        }

        .flagged-table tbody tr:hover {
          background: #f9fafb;
        }

        .flagged-table tbody tr.unresolved:hover {
          background: #fee2e2;
        }

        .flagged-table td {
          padding: 16px;
          font-size: 14px;
          color: #374151;
        }

        .flag-id,
        .chat-id {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
        }

        .flag-id .la {
          color: #dc2626;
          font-size: 16px;
        }

        .chat-id .la {
          color: #8b5cf6;
          font-size: 16px;
        }

        .flagged-by {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .flagged-by .la {
          color: #8b5cf6;
          font-size: 18px;
        }

        .flagged-by-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .flagged-by-info strong {
          font-size: 14px;
          color: #1f2937;
          font-weight: 600;
        }

        .flagged-by-info small {
          font-size: 12px;
          color: #9ca3af;
        }

        .reason-cell {
          max-width: 300px;
        }

        .reason-text {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.5;
          color: #dc2626;
          font-weight: 500;
        }

        .date-cell {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6b7280;
          white-space: nowrap;
        }

        .date-cell .la {
          color: #9ca3af;
          font-size: 14px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .status-badge.resolved {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.unresolved {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .status-badge .la {
          font-size: 14px;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-view,
        .btn-resolve {
          height: 36px;
          padding: 0 14px;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .btn-view {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-view:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-resolve {
          background: #10b981;
          color: white;
        }

        .btn-resolve:hover {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .btn-view .la,
        .btn-resolve .la {
          font-size: 14px;
        }

        @media (max-width: 1200px) {
          .reason-cell {
            max-width: 200px;
          }
        }

        @media (max-width: 992px) {
          .flagged-table {
            font-size: 13px;
          }

          .flagged-table th,
          .flagged-table td {
            padding: 12px;
          }

          .reason-cell {
            max-width: 150px;
          }

          .action-buttons {
            flex-direction: column;
          }
        }

        @media (max-width: 768px) {
          .table-container {
            overflow-x: auto;
          }

          .flagged-table {
            min-width: 900px;
          }
        }
      `}</style>
    </>
  );
};

export default FlaggedChatsList;
