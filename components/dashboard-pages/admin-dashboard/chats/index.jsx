'use client';

import { useEffect, useState } from 'react';
import AdminService from '@/services/adminService';
import { toast } from 'react-toastify';
import ChatsList from './components/ChatsList';
import ChatDetailsModal from './components/ChatDetailsModal';
import FlaggedChatsList from './components/FlaggedChatsList';
import ResolveFlagModal from './components/ResolveFlagModal';

const AdminChats = () => {
  const [activeTab, setActiveTab] = useState('all'); // all, flagged
  const [chats, setChats] = useState([]);
  const [flaggedChats, setFlaggedChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArchived, setFilterArchived] = useState('active'); // all, active, archived
  const [filterResolved, setFilterResolved] = useState('unresolved'); // all, unresolved, resolved
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);

  useEffect(() => {
    if (activeTab === 'all') {
      fetchChats();
    } else if (activeTab === 'flagged') {
      fetchFlaggedChats();
    }
  }, [activeTab, filterArchived, filterResolved]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filterArchived === 'archived') {
        params.include_archived = 1;
      }
      
      const data = await AdminService.getAllChats(params);
      
      // Handle different response formats
      let chatsList = [];
      if (Array.isArray(data)) {
        chatsList = data;
      } else if (data && data.results) {
        chatsList = data.results;
      } else if (data && data.data) {
        if (Array.isArray(data.data)) {
          chatsList = data.data;
        } else if (data.data.results) {
          chatsList = data.data.results;
        }
      }
      
      // Filter archived/active if needed (backend uses is_active)
      if (filterArchived === 'active') {
        chatsList = chatsList.filter(chat => chat.is_active !== false);
      } else if (filterArchived === 'archived') {
        chatsList = chatsList.filter(chat => chat.is_active === false);
      }
      
      setChats(chatsList);
    } catch (err) {
      console.error('Failed to fetch chats:', err);
      toast.error(err.response?.data?.detail || 'Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const fetchFlaggedChats = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filterResolved === 'resolved') {
        params.resolved = true;
      } else if (filterResolved === 'unresolved') {
        params.resolved = false;
      }
      
      const data = await AdminService.getFlaggedChats(params);
      
      // Handle different response formats
      let flaggedList = [];
      if (Array.isArray(data)) {
        flaggedList = data;
      } else if (data && data.results) {
        flaggedList = data.results;
      } else if (data && data.data) {
        if (Array.isArray(data.data)) {
          flaggedList = data.data;
        } else if (data.data.results) {
          flaggedList = data.data.results;
        }
      }
      
      setFlaggedChats(flaggedList);
    } catch (err) {
      console.error('Failed to fetch flagged chats:', err);
      toast.error(err.response?.data?.detail || 'Failed to load flagged chats');
    } finally {
      setLoading(false);
    }
  };

  const handleViewChat = async (chatOrFlag) => {
    try {
      // Handle both direct chat objects and flagged chat objects
      let chatId = chatOrFlag.id || chatOrFlag.chat_id || chatOrFlag.chat || chatOrFlag.pk;
      const fullChat = await AdminService.getChatById(chatId);
      setSelectedChat(fullChat);
      setShowChatModal(true);
    } catch (err) {
      console.error('Failed to load chat details:', err);
      toast.error('Failed to load chat details');
    }
  };

  const handleArchiveChat = async (chatId, reason = '') => {
    try {
      await AdminService.archiveChat(chatId, reason);
      toast.success('Chat archived successfully');
      fetchChats();
    } catch (err) {
      toast.error('Failed to archive chat');
    }
  };

  const handleResolveFlag = (flag) => {
    setSelectedFlag(flag);
    setShowFlagModal(true);
  };

  const handleFlagResolved = async (flagId, resolutionNotes) => {
    try {
      await AdminService.updateFlaggedChat(flagId, {
        resolved: true,
        resolution_notes: resolutionNotes
      });
      toast.success('Flag resolved successfully');
      setShowFlagModal(false);
      setSelectedFlag(null);
      fetchFlaggedChats();
    } catch (err) {
      toast.error('Failed to resolve flag');
    }
  };

  const filteredChats = chats.filter((chat) => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      chat.employer_name?.toLowerCase().includes(search) ||
      chat.cleaner_name?.toLowerCase().includes(search) ||
      chat.job_title?.toLowerCase().includes(search) ||
      chat.id?.toString().includes(search)
    );
  });

  const filteredFlaggedChats = flaggedChats.filter((flag) => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      flag.reason?.toLowerCase().includes(search) ||
      flag.flagged_by_name?.toLowerCase().includes(search) ||
      flag.chat_id?.toString().includes(search)
    );
  });

  return (
    <>
      <div className="admin-chats">
        <div className="page-header">
          <div>
            <h2>Chat Moderation</h2>
            <p className="subtitle">Monitor and moderate all chat conversations</p>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <span className="la la-search"></span>
              <input
                type="text"
                placeholder={activeTab === 'all' ? 'Search chats...' : 'Search flags...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className="btn-refresh" 
              onClick={activeTab === 'all' ? fetchChats : fetchFlaggedChats}
            >
              <span className="la la-sync"></span>
              Refresh
            </button>
          </div>
        </div>

        <div className="tabs-section">
          <button 
            className={activeTab === 'all' ? 'active' : ''} 
            onClick={() => setActiveTab('all')}
          >
            <span className="la la-comments"></span>
            All Chats
            {chats.length > 0 && <span className="count-badge">{chats.length}</span>}
          </button>
          <button 
            className={activeTab === 'flagged' ? 'active' : ''} 
            onClick={() => setActiveTab('flagged')}
          >
            <span className="la la-flag"></span>
            Flagged Chats
            {flaggedChats.filter(f => !f.resolved).length > 0 && (
              <span className="count-badge alert">{flaggedChats.filter(f => !f.resolved).length}</span>
            )}
          </button>
        </div>

        {activeTab === 'all' && (
          <>
            <div className="filters-section">
              <button 
                className={filterArchived === 'active' ? 'active' : ''} 
                onClick={() => setFilterArchived('active')}
              >
                <span className="la la-check-circle"></span>
                Active
              </button>
              <button 
                className={filterArchived === 'all' ? 'active' : ''} 
                onClick={() => setFilterArchived('all')}
              >
                <span className="la la-list"></span>
                All Chats
              </button>
              <button 
                className={filterArchived === 'archived' ? 'active' : ''} 
                onClick={() => setFilterArchived('archived')}
              >
                <span className="la la-archive"></span>
                Archived
              </button>
            </div>

            <ChatsList
              chats={filteredChats}
              loading={loading}
              searchTerm={searchTerm}
              onView={handleViewChat}
              onArchive={handleArchiveChat}
            />
          </>
        )}

        {activeTab === 'flagged' && (
          <>
            <div className="filters-section">
              <button 
                className={filterResolved === 'unresolved' ? 'active' : ''} 
                onClick={() => setFilterResolved('unresolved')}
              >
                <span className="la la-exclamation-circle"></span>
                Unresolved
              </button>
              <button 
                className={filterResolved === 'all' ? 'active' : ''} 
                onClick={() => setFilterResolved('all')}
              >
                <span className="la la-list"></span>
                All Flags
              </button>
              <button 
                className={filterResolved === 'resolved' ? 'active' : ''} 
                onClick={() => setFilterResolved('resolved')}
              >
                <span className="la la-check-circle"></span>
                Resolved
              </button>
            </div>

            <FlaggedChatsList
              flaggedChats={filteredFlaggedChats}
              loading={loading}
              searchTerm={searchTerm}
              onViewChat={handleViewChat}
              onResolve={handleResolveFlag}
            />
          </>
        )}
      </div>

      {showChatModal && (
        <ChatDetailsModal
          chat={selectedChat}
          onClose={() => {
            setShowChatModal(false);
            setSelectedChat(null);
          }}
          onArchived={() => {
            setShowChatModal(false);
            setSelectedChat(null);
            fetchChats();
          }}
        />
      )}

      {showFlagModal && (
        <ResolveFlagModal
          flag={selectedFlag}
          onClose={() => {
            setShowFlagModal(false);
            setSelectedFlag(null);
          }}
          onResolved={() => {
            setShowFlagModal(false);
            setSelectedFlag(null);
            fetchFlaggedChats();
          }}
        />
      )}

      <style jsx>{`
        .admin-chats {
          padding: 30px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          gap: 20px;
        }

        .page-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .search-box {
          position: relative;
          width: 280px;
        }

        .search-box input {
          width: 100%;
          height: 44px;
          padding: 0 16px 0 44px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .search-box input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .search-box .la-search {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 18px;
        }

        .btn-refresh {
          height: 44px;
          padding: 0 20px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          color: #4b5563;
        }

        .btn-refresh:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .btn-refresh .la {
          font-size: 16px;
        }

        .tabs-section {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0;
        }

        .tabs-section button {
          height: 48px;
          padding: 0 24px;
          border: none;
          background: transparent;
          border-bottom: 3px solid transparent;
          font-size: 15px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          position: relative;
        }

        .tabs-section button:hover {
          color: #8b5cf6;
        }

        .tabs-section button.active {
          color: #8b5cf6;
          border-bottom-color: #8b5cf6;
        }

        .tabs-section button .la {
          font-size: 18px;
        }

        .count-badge {
          background: #e5e7eb;
          color: #4b5563;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
        }

        .count-badge.alert {
          background: #fee2e2;
          color: #991b1b;
        }

        .tabs-section button.active .count-badge {
          background: #f3e8ff;
          color: #8b5cf6;
        }

        .filters-section {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .filters-section button {
          height: 44px;
          padding: 0 20px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #4b5563;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .filters-section button:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
          background: #faf5ff;
        }

        .filters-section button.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
          color: white;
        }

        .filters-section button .la {
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .admin-chats {
            padding: 20px;
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-actions {
            flex-direction: column;
          }

          .search-box {
            width: 100%;
          }

          .tabs-section {
            overflow-x: auto;
            flex-wrap: nowrap;
          }

          .filters-section {
            overflow-x: auto;
            flex-wrap: nowrap;
          }
        }
      `}</style>
    </>
  );
};

export default AdminChats;
