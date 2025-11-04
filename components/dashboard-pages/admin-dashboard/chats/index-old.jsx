'use client';

import { useEffect, useState } from 'react';
import AdminService from '@/services/adminService';
import { toast } from 'react-toastify';

const AdminChats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, employer, cleaner, flagged
  const [selectedChat, setSelectedChat] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    fetchChats();
  }, [filterType]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      let data = [];
      
      // Since we don't have a get-all-chats endpoint, show instructions
      setChats([]);
      toast.info('Enter an Employer ID or Cleaner ID to view their chats');
    } catch (err) {
      console.error('Failed to fetch chats:', err);
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!userId.trim()) {
      toast.error('Please enter a user ID');
      return;
    }

    try {
      setLoading(true);
      let data = [];

      if (filterType === 'employer') {
        data = await AdminService.getEmployerChats(userId);
      } else if (filterType === 'cleaner') {
        data = await AdminService.getCleanerChats(userId);
      } else if (filterType === 'flagged') {
        data = await AdminService.getFlaggedChats();
      }

      setChats(Array.isArray(data) ? data : data.results || []);
      
      if ((Array.isArray(data) ? data : data.results || []).length === 0) {
        toast.info('No chats found for this user');
      }
    } catch (err) {
      console.error('Failed to fetch chats:', err);
      toast.error(err?.response?.data?.detail || 'Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const handleViewChat = (chat) => {
    setSelectedChat(chat);
    setShowViewModal(true);
  };

  const filteredChats = chats.filter((chat) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    const message = chat.message?.toLowerCase() || '';
    const senderEmail = chat.sender?.email?.toLowerCase() || '';
    const receiverEmail = chat.receiver?.email?.toLowerCase() || '';
    
    return message.includes(search) || senderEmail.includes(search) || receiverEmail.includes(search);
  });

  return (
    <div className="admin-chats">
      <div className="page-header">
        <div>
          <h2>Chat Moderation</h2>
          <p>Monitor and manage user conversations</p>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-tabs">
          <button
            className={filterType === 'employer' ? 'active' : ''}
            onClick={() => setFilterType('employer')}
          >
            <span className="la la-briefcase"></span>
            Employer Chats
          </button>
          <button
            className={filterType === 'cleaner' ? 'active' : ''}
            onClick={() => setFilterType('cleaner')}
          >
            <span className="la la-user-tie"></span>
            Cleaner Chats
          </button>
          <button
            className={filterType === 'flagged' ? 'active' : ''}
            onClick={() => setFilterType('flagged')}
          >
            <span className="la la-flag"></span>
            Flagged Chats
          </button>
        </div>

        <div className="search-section">
          {filterType !== 'flagged' && (
            <input
              type="number"
              placeholder={`Enter ${filterType === 'employer' ? 'Employer' : 'Cleaner'} ID...`}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="user-id-input"
            />
          )}
          <button className="btn-search" onClick={handleSearch}>
            <span className="la la-search"></span>
            {filterType === 'flagged' ? 'Load Flagged' : 'Search Chats'}
          </button>
        </div>

        {chats.length > 0 && (
          <div className="search-box">
            <span className="la la-search"></span>
            <input
              type="text"
              placeholder="Filter by message or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading chats...</p>
        </div>
      ) : chats.length === 0 ? (
        <div className="empty-state">
          <span className="la la-comments empty-icon"></span>
          <h3>No Chats Found</h3>
          <p>
            {filterType === 'flagged'
              ? 'No flagged chats at the moment'
              : `Enter a ${filterType === 'employer' ? 'Employer' : 'Cleaner'} ID above to view their conversations`}
          </p>
        </div>
      ) : (
        <div className="chats-grid">
          {filteredChats.map((chat) => (
            <div key={chat.id} className="chat-card" onClick={() => handleViewChat(chat)}>
              <div className="chat-header">
                <div className="chat-users">
                  <div className="user">
                    <span className="la la-user-circle"></span>
                    <span>{chat.sender?.email || chat.sender?.name || 'Unknown'}</span>
                  </div>
                  <span className="la la-arrow-right"></span>
                  <div className="user">
                    <span className="la la-user-circle"></span>
                    <span>{chat.receiver?.email || chat.receiver?.name || 'Unknown'}</span>
                  </div>
                </div>
                {chat.is_flagged && (
                  <span className="flag-badge">
                    <span className="la la-flag"></span>
                    Flagged
                  </span>
                )}
              </div>
              <div className="chat-message">
                {chat.message?.substring(0, 120)}
                {chat.message?.length > 120 ? '...' : ''}
              </div>
              <div className="chat-footer">
                <span className="timestamp">
                  {new Date(chat.created_at || chat.timestamp).toLocaleString()}
                </span>
                {chat.is_read === false && <span className="unread-badge">Unread</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Chat Modal */}
      {showViewModal && selectedChat && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chat Details</h3>
              <button className="close-btn" onClick={() => setShowViewModal(false)}>
                <span className="la la-times"></span>
              </button>
            </div>
            <div className="modal-body">
              <div className="chat-detail">
                <div className="participants">
                  <div className="participant">
                    <label>Sender:</label>
                    <div>
                      <strong>{selectedChat.sender?.email || selectedChat.sender?.name || 'Unknown'}</strong>
                      <small>ID: {selectedChat.sender?.id || 'N/A'}</small>
                    </div>
                  </div>
                  <div className="participant">
                    <label>Receiver:</label>
                    <div>
                      <strong>{selectedChat.receiver?.email || selectedChat.receiver?.name || 'Unknown'}</strong>
                      <small>ID: {selectedChat.receiver?.id || 'N/A'}</small>
                    </div>
                  </div>
                </div>

                <div className="message-box">
                  <label>Message:</label>
                  <p>{selectedChat.message}</p>
                </div>

                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className={selectedChat.is_read ? 'read' : 'unread'}>
                      {selectedChat.is_read ? 'Read' : 'Unread'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Flagged:</label>
                    <span className={selectedChat.is_flagged ? 'flagged' : ''}>
                      {selectedChat.is_flagged ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Sent At:</label>
                    <span>{new Date(selectedChat.created_at || selectedChat.timestamp).toLocaleString()}</span>
                  </div>
                  {selectedChat.job_id && (
                    <div className="detail-item">
                      <label>Related Job:</label>
                      <span>Job #{selectedChat.job_id}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-chats {
          padding: 30px;
        }

        .page-header {
          margin-bottom: 30px;
        }

        .page-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px;
        }

        .page-header p {
          font-size: 15px;
          color: #6b7280;
          margin: 0;
        }

        .filters-section {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .filter-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .filter-tabs button {
          padding: 10px 20px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #4b5563;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .filter-tabs button:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
        }

        .filter-tabs button.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
          color: white;
        }

        .search-section {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .user-id-input {
          flex: 1;
          height: 44px;
          padding: 0 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .user-id-input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .btn-search {
          height: 44px;
          padding: 0 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .btn-search:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .search-box {
          position: relative;
        }

        .search-box span {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 18px;
        }

        .search-box input {
          width: 100%;
          height: 44px;
          padding: 0 16px 0 44px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .search-box input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .loading-state,
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-icon {
          font-size: 64px;
          color: #d1d5db;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px;
        }

        .empty-state p {
          font-size: 15px;
          color: #6b7280;
          margin: 0;
        }

        .chats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .chat-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .chat-card:hover {
          border-color: #8b5cf6;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          gap: 12px;
        }

        .chat-users {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          font-size: 13px;
        }

        .chat-users .user {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #4b5563;
        }

        .chat-users .user span:first-child {
          font-size: 18px;
          color: #8b5cf6;
        }

        .chat-users .la-arrow-right {
          color: #d1d5db;
        }

        .flag-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: #fef3c7;
          color: #92400e;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .chat-message {
          font-size: 14px;
          color: #1f2937;
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .chat-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .timestamp {
          font-size: 12px;
          color: #9ca3af;
        }

        .unread-badge {
          padding: 4px 10px;
          background: #dbeafe;
          color: #1e40af;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

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
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
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

        .chat-detail {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .participants {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .participant {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .participant label {
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .participant strong {
          display: block;
          font-size: 15px;
          color: #1f2937;
        }

        .participant small {
          display: block;
          font-size: 13px;
          color: #9ca3af;
        }

        .message-box {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .message-box label {
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .message-box p {
          margin: 0;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          font-size: 15px;
          color: #1f2937;
          line-height: 1.6;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .detail-item label {
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-item span {
          font-size: 15px;
          color: #1f2937;
        }

        .detail-item span.read {
          color: #059669;
        }

        .detail-item span.unread {
          color: #dc2626;
        }

        .detail-item span.flagged {
          color: #d97706;
          font-weight: 600;
        }

        .modal-footer {
          padding: 20px 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
        }

        .btn-secondary {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          background: #f3f4f6;
          color: #374151;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        @media (max-width: 768px) {
          .admin-chats {
            padding: 20px;
          }

          .chats-grid {
            grid-template-columns: 1fr;
          }

          .filter-tabs {
            flex-direction: column;
          }

          .search-section {
            flex-direction: column;
          }

          .participants,
          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminChats;
