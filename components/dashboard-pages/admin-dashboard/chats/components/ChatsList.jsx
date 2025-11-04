'use client';

const ChatsList = ({ chats, loading, searchTerm, onView, onArchive }) => {
  if (loading) {
    return (
      <>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading chats...</p>
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

  if (chats.length === 0) {
    return (
      <>
        <div className="empty-state">
          <span className="la la-comments"></span>
          <h3>No chats found</h3>
          <p>{searchTerm ? 'Try adjusting your search criteria' : 'No chat conversations yet'}</p>
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
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <>
      <div className="chats-grid">
        {chats.map((chat) => {
          // Extract names from nested structure: chat.employer.user.name
          const employerName = chat.employer?.user?.name || 
                              chat.employer?.user?.email?.split('@')[0] ||
                              chat.employer?.business_name ||
                              `Employer #${chat.employer?.id || chat.employer}`;
          
          const cleanerName = chat.cleaner?.user?.name || 
                             chat.cleaner?.user?.email?.split('@')[0] ||
                             `Cleaner #${chat.cleaner?.id || chat.cleaner}`;
          
          const jobTitle = chat.last_booking?.job_title || null;
          
          return (
            <div key={chat.id} className={`chat-card ${!chat.is_active ? 'archived' : ''}`}>
              <div className="chat-header">
                <div className="participants">
                  <span className="la la-user-tie"></span>
                  <strong>{employerName}</strong>
                  <span className="separator">↔</span>
                  <span className="la la-user"></span>
                  <strong>{cleanerName}</strong>
                </div>
                {!chat.is_active && (
                  <span className="archived-badge">
                    <span className="la la-archive"></span> Archived
                  </span>
                )}
                {chat.is_flagged && (
                  <span className="flagged-badge">
                    <span className="la la-flag"></span> Flagged
                  </span>
                )}
              </div>

              {jobTitle && (
                <div className="job-info">
                  <span className="la la-briefcase"></span>
                  <span>{jobTitle}</span>
                </div>
              )}

              <div className="chat-stats">
                <div className="stat-item">
                  <span className="la la-calendar"></span>
                  <span>Created {formatDate(chat.created_at)}</span>
                </div>
                {chat.unread_count > 0 && (
                  <div className="stat-item unread">
                    <span className="la la-envelope"></span>
                    <span>{chat.unread_count} unread</span>
                  </div>
                )}
              </div>

            <div className="action-buttons">
              <button
                className="btn-view"
                onClick={() => onView(chat)}
                title="View Chat"
              >
                <span className="la la-eye"></span>
                View Chat Details
              </button>
              {chat.is_active && (
                <button
                  className="btn-archive"
                  onClick={() => {
                    if (confirm('Are you sure you want to archive this chat?')) {
                      onArchive(chat.id, 'Archived by admin');
                    }
                  }}
                  title="Archive Chat"
                >
                  <span className="la la-archive"></span>
                  Archive
                </button>
              )}
            </div>
          </div>
          );
        })}
      </div>

      <style jsx>{`
        .chats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 20px;
        }

        .chat-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
          border: 2px solid transparent;
        }

        .chat-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .chat-card.archived {
          opacity: 0.7;
          border-color: #e5e7eb;
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          gap: 12px;
        }

        .participants {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          flex: 1;
        }

        .participants .la {
          color: #8b5cf6;
          font-size: 16px;
        }

        .participants strong {
          font-size: 14px;
          color: #1f2937;
          font-weight: 600;
        }

        .separator {
          color: #9ca3af;
          font-weight: 400;
        }

        .archived-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: #f3f4f6;
          color: #6b7280;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .flagged-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: #fee2e2;
          color: #dc2626;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .job-info {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #f9fafb;
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .job-info .la {
          color: #8b5cf6;
          font-size: 14px;
        }

        .job-info span {
          font-size: 13px;
          color: #4b5563;
          font-weight: 500;
        }

        .chat-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f3f4f6;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #6b7280;
        }

        .stat-item .la {
          font-size: 14px;
        }

        .stat-item.unread {
          color: #dc2626;
          font-weight: 600;
        }

        .last-message {
          padding: 10px;
          background: #f9fafb;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 13px;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .last-message strong {
          color: #1f2937;
          margin-right: 6px;
        }

        .last-message span {
          color: #6b7280;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-view,
        .btn-archive {
          flex: 1;
          height: 38px;
          padding: 0 16px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .btn-view {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-view:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-archive {
          background: white;
          color: #6b7280;
          border: 1px solid #e5e7eb;
        }

        .btn-archive:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .btn-view .la,
        .btn-archive .la {
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .chats-grid {
            grid-template-columns: 1fr;
          }

          .participants {
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
};

export default ChatsList;
