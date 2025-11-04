'use client';

import { useState, useEffect, useRef } from 'react';
import AdminService from '@/services/adminService';
import { toast } from 'react-toastify';

const ChatDetailsModal = ({ chat, onClose, onArchived }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showArchiveForm, setShowArchiveForm] = useState(false);
  const [archiveReason, setArchiveReason] = useState('');
  const [archiving, setArchiving] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chat?.id) {
      fetchMessages();
    }
  }, [chat?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      console.log('Fetching messages for chat ID:', chat.id);
      const response = await AdminService.getChatMessages(chat.id);
      console.log('Messages API Response:', response);
      console.log('Response type:', typeof response);
      console.log('Is array?', Array.isArray(response));
      
      let messagesList = [];
      
      if (Array.isArray(response)) {
        messagesList = response;
        console.log('Response is array, length:', messagesList.length);
      } else if (response?.data) {
        console.log('Response has data property');
        messagesList = Array.isArray(response.data) ? response.data : 
                      Array.isArray(response.data.results) ? response.data.results : [];
        console.log('Extracted from data, length:', messagesList.length);
      } else if (response?.results) {
        console.log('Response has results property');
        messagesList = response.results;
        console.log('Extracted from results, length:', messagesList.length);
      }
      
      console.log('Final messages list:', messagesList);
      
      // Sort by sent_at timestamp
      messagesList.sort((a, b) => {
        const dateA = new Date(a.sent_at || a.created_at);
        const dateB = new Date(b.sent_at || b.created_at);
        return dateA - dateB;
      });
      
      console.log('Messages after sorting:', messagesList.length);
      setMessages(messagesList);
    } catch (error) {
      console.error('Error fetching messages:', error);
      console.error('Error response:', error.response);
      toast.error('Failed to load messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!archiveReason.trim()) {
      toast.error('Please provide a reason for archiving');
      return;
    }

    setArchiving(true);
    try {
      await AdminService.archiveChat(chat.id, archiveReason);
      toast.success('Chat archived successfully');
      onArchived?.();
      onClose();
    } catch (error) {
      console.error('Error archiving chat:', error);
      toast.error('Failed to archive chat');
    } finally {
      setArchiving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = formatDate(message.created_at || message.sent_at);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="header-content">
              <h2>
                <span className="la la-comments"></span>
                Chat Details
              </h2>
              <p className="chat-id">Chat #{chat.id}</p>
            </div>
            <button className="close-btn" onClick={onClose}>
              <span className="la la-times"></span>
            </button>
          </div>

          <div className="modal-body">
            <div className="chat-info-section">
              <h3>
                <span className="la la-info-circle"></span>
                Chat Information
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Employer</span>
                  <span className="info-value">
                    <span className="la la-user-tie"></span>
                    {chat.employer?.user?.name || 
                     chat.employer?.user?.email?.split('@')[0] ||
                     chat.employer?.business_name ||
                     `Employer #${chat.employer?.id}`}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Cleaner</span>
                  <span className="info-value">
                    <span className="la la-user"></span>
                    {chat.cleaner?.user?.name || 
                     chat.cleaner?.user?.email?.split('@')[0] ||
                     `Cleaner #${chat.cleaner?.id}`}
                  </span>
                </div>
                {chat.last_booking?.job_title && (
                  <div className="info-item full-width">
                    <span className="info-label">Job</span>
                    <span className="info-value">
                      <span className="la la-briefcase"></span>
                      {chat.last_booking.job_title}
                    </span>
                  </div>
                )}
                <div className="info-item">
                  <span className="info-label">Created</span>
                  <span className="info-value">{formatDate(chat.created_at)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Total Messages</span>
                  <span className="info-value">{messages.length}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status</span>
                  <span className={`status-badge ${!chat.is_active ? 'archived' : 'active'}`}>
                    {!chat.is_active ? (
                      <>
                        <span className="la la-archive"></span>
                        Archived
                      </>
                    ) : (
                      <>
                        <span className="la la-check-circle"></span>
                        Active
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="messages-section">
              <h3>
                <span className="la la-comment-dots"></span>
                Message History
                <span className="message-count">({messages.length} messages)</span>
              </h3>
              
              {loading ? (
                <div className="messages-loading">
                  <div className="spinner"></div>
                  <p>Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="messages-empty">
                  <span className="la la-comment-slash"></span>
                  <p>No messages in this chat yet</p>
                </div>
              ) : (
                <div className="messages-container">
                  {Object.entries(messageGroups).map(([date, dateMessages]) => (
                    <div key={date} className="message-date-group">
                      <div className="date-divider">
                        <span>{date}</span>
                      </div>
                      {dateMessages.map((message) => {
                        // Determine sender type - backend uses 'e' for employer, 'c' for cleaner
                        const senderType = message.sender_type || message.sender;
                        const isEmployer = senderType === 'employer' || senderType === 'e';
                        const timestamp = message.created_at || message.sent_at;
                        
                        // Get sender name from chat context
                        const senderName = isEmployer 
                          ? (chat.employer?.user?.name || 'Employer')
                          : (chat.cleaner?.user?.name || 'Cleaner');
                        
                        return (
                          <div
                            key={message.id}
                            className={`message-bubble ${isEmployer ? 'employer' : 'cleaner'}`}
                          >
                            <div className="message-header">
                              <span className="sender-name">
                                {isEmployer ? (
                                  <>
                                    <span className="la la-user-tie"></span>
                                    {senderName}
                                  </>
                                ) : (
                                  <>
                                    <span className="la la-user"></span>
                                    {senderName}
                                  </>
                                )}
                              </span>
                              <span className="message-time">{formatTime(timestamp)}</span>
                            </div>
                            <div className="message-content">{message.content}</div>
                            {message.is_read && (
                              <div className="message-status">
                                <span className="la la-check-double"></span>
                                Read
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {chat.is_active && (
              <div className="archive-section">
                {!showArchiveForm ? (
                  <button
                    className="btn-show-archive"
                    onClick={() => setShowArchiveForm(true)}
                  >
                    <span className="la la-archive"></span>
                    Archive This Chat
                  </button>
                ) : (
                  <div className="archive-form">
                    <h4>Archive Chat</h4>
                    <p>Please provide a reason for archiving this chat:</p>
                    <textarea
                      value={archiveReason}
                      onChange={(e) => setArchiveReason(e.target.value)}
                      placeholder="e.g., Inappropriate content, Completed conversation, User request..."
                      rows={3}
                    />
                    <div className="archive-actions">
                      <button
                        className="btn-cancel"
                        onClick={() => {
                          setShowArchiveForm(false);
                          setArchiveReason('');
                        }}
                        disabled={archiving}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn-archive"
                        onClick={handleArchive}
                        disabled={archiving || !archiveReason.trim()}
                      >
                        {archiving ? 'Archiving...' : 'Archive Chat'}
                      </button>
                    </div>
                  </div>
                )}
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
          z-index: 9999;
          padding: 20px;
        }

        .modal-container {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 24px 28px;
          border-bottom: 1px solid #e5e7eb;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px 12px 0 0;
        }

        .header-content {
          flex: 1;
        }

        .modal-header h2 {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 6px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .modal-header h2 .la {
          font-size: 28px;
        }

        .chat-id {
          margin: 0;
          font-size: 14px;
          opacity: 0.9;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .modal-body {
          overflow-y: auto;
          padding: 28px;
          flex: 1;
        }

        .chat-info-section {
          background: #f9fafb;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .chat-info-section h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chat-info-section h3 .la {
          color: #8b5cf6;
          font-size: 20px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .info-item.full-width {
          grid-column: 1 / -1;
        }

        .info-label {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
        }

        .info-value {
          font-size: 15px;
          color: #1f2937;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .info-value .la {
          color: #8b5cf6;
          font-size: 16px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          width: fit-content;
        }

        .status-badge.active {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.archived {
          background: #f3f4f6;
          color: #6b7280;
        }

        .messages-section {
          margin-bottom: 24px;
        }

        .messages-section h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .messages-section h3 .la {
          color: #8b5cf6;
          font-size: 20px;
        }

        .message-count {
          font-size: 14px;
          color: #6b7280;
          font-weight: 400;
        }

        .messages-loading,
        .messages-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          background: #f9fafb;
          border-radius: 12px;
        }

        .messages-loading .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f4f6;
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 12px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .messages-loading p,
        .messages-empty p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .messages-empty .la {
          font-size: 60px;
          color: #e5e7eb;
          margin-bottom: 12px;
        }

        .messages-container {
          background: #f9fafb;
          padding: 20px;
          border-radius: 12px;
          max-height: 500px;
          overflow-y: auto;
        }

        .message-date-group {
          margin-bottom: 24px;
        }

        .message-date-group:last-child {
          margin-bottom: 0;
        }

        .date-divider {
          text-align: center;
          margin: 0 0 16px 0;
        }

        .date-divider span {
          display: inline-block;
          background: #e5e7eb;
          color: #6b7280;
          padding: 4px 16px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .message-bubble {
          background: white;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          max-width: 80%;
        }

        .message-bubble.employer {
          margin-left: auto;
          background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
          border-bottom-right-radius: 4px;
        }

        .message-bubble.cleaner {
          margin-right: auto;
          background: white;
          border-bottom-left-radius: 4px;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          gap: 12px;
        }

        .sender-name {
          font-size: 13px;
          font-weight: 600;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sender-name .la {
          color: #8b5cf6;
          font-size: 14px;
        }

        .message-time {
          font-size: 12px;
          color: #9ca3af;
        }

        .message-content {
          font-size: 14px;
          color: #374151;
          line-height: 1.5;
          word-wrap: break-word;
        }

        .message-status {
          margin-top: 6px;
          font-size: 11px;
          color: #8b5cf6;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .archive-section {
          background: #fef3c7;
          padding: 20px;
          border-radius: 12px;
          border: 2px solid #fbbf24;
        }

        .btn-show-archive {
          width: 100%;
          height: 44px;
          background: white;
          border: 2px solid #f59e0b;
          color: #f59e0b;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .btn-show-archive:hover {
          background: #f59e0b;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .archive-form h4 {
          font-size: 16px;
          font-weight: 600;
          color: #92400e;
          margin: 0 0 8px 0;
        }

        .archive-form p {
          font-size: 14px;
          color: #78350f;
          margin: 0 0 12px 0;
        }

        .archive-form textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #fbbf24;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
          margin-bottom: 12px;
        }

        .archive-form textarea:focus {
          outline: none;
          border-color: #f59e0b;
        }

        .archive-actions {
          display: flex;
          gap: 10px;
        }

        .btn-cancel,
        .btn-archive {
          flex: 1;
          height: 40px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel {
          background: white;
          color: #6b7280;
          border: 1px solid #d1d5db;
        }

        .btn-cancel:hover:not(:disabled) {
          background: #f9fafb;
        }

        .btn-archive {
          background: #f59e0b;
          color: white;
        }

        .btn-archive:hover:not(:disabled) {
          background: #d97706;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .btn-archive:disabled,
        .btn-cancel:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-footer {
          padding: 20px 28px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
        }

        .btn-close {
          height: 44px;
          padding: 0 32px;
          background: #e5e7eb;
          color: #1f2937;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-close:hover {
          background: #d1d5db;
        }

        @media (max-width: 768px) {
          .modal-container {
            max-height: 95vh;
          }

          .modal-header,
          .modal-body,
          .modal-footer {
            padding: 20px;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .message-bubble {
            max-width: 90%;
          }
        }
      `}</style>
    </>
  );
};

export default ChatDetailsModal;
