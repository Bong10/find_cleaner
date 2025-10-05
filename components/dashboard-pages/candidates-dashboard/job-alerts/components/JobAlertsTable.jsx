"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NotificationDetails from "./NotificationDetails";
import ConfirmModal, { useConfirm } from "../../../../common/ConfirmModal";
// Future: import { getAllNotifications, markAsRead, deleteNotification } from '@/services/cleanerService';

const JobAlertsTable = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // all, unread, job, message, alert
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const notificationId = searchParams.get("notification");
  const { confirmState, confirm, closeConfirm } = useConfirm();

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // TODO: Uncomment when backend endpoint is ready
      // const response = await getAllNotifications({ filter });
      // setNotifications(response?.data || []);
      
      // For now, return empty array until backend is connected
      setNotifications([]);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      // TODO: Call backend API to mark as read
      // await markAsRead(id);
      
      setNotifications(prev => 
        prev.map(n => n.id == id ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDeleteFromList = async (notificationId, notificationTitle) => {
    const shouldDelete = await confirm({
      title: "Delete Notification",
      message: `Are you sure you want to delete "${notificationTitle}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmStyle: "danger",
      icon: "la-trash"
    });

    if (shouldDelete) {
      try {
        // TODO: Call backend API to delete
        // await deleteNotification(notificationId);
        
        setNotifications(prev => prev.filter(n => n.id != notificationId));
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    }
  };

  const handleDeleteFromDetails = (notificationId) => {
    // Just remove from state, no confirmation needed as it's handled in details page
    setNotifications(prev => prev.filter(n => n.id != notificationId));
  };

  const handleView = (id) => {
    router.push(`/candidates-dashboard/job-alerts?notification=${id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getCategoryStyle = (category) => {
    switch(category?.toLowerCase()) {
      case 'job':
        return { background: '#e8f5e9', color: '#2e7d32' };
      case 'message':
        return { background: '#fff3e0', color: '#ff9800' };
      case 'alert':
        return { background: '#f3e5f5', color: '#9c27b0' };
      default:
        return { background: '#f5f5f5', color: '#666' };
    }
  };

  // If notification ID is present, show details page
  if (notificationId) {
    return (
      <NotificationDetails 
        notifications={notifications} 
        onMarkAsRead={handleMarkAsRead} 
        onDelete={handleDeleteFromDetails}
      />
    );
  }

  // Show notifications list
  return (
    <>
      <div className="tabs-box">
        <div className="widget-title">
          <h4>All Notifications</h4>

          <div className="chosen-outer">
            {/* Filter dropdown */}
            <select 
              className="chosen-single form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="job">Job Related</option>
              <option value="message">Messages</option>
              <option value="alert">Alerts</option>
            </select>
          </div>
        </div>
        {/* End filter top bar */}

        {/* Start table widget content */}
        <div className="widget-content">
          <div className="table-outer">
            <table className="default-table manage-job-table">
              <thead>
                <tr>
                  <th>Notification</th>
                  <th style={{ textAlign: 'center' }}>Type</th>
                  <th style={{ textAlign: 'center' }}>Time</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '50px' }}>
                      <div style={{ color: '#666' }}>
                        <i className="la la-spinner la-spin" style={{ fontSize: '32px', marginBottom: '10px' }}></i>
                        <p style={{ fontSize: '16px', margin: 0 }}>Loading notifications...</p>
                      </div>
                    </td>
                  </tr>
                ) : notifications.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '60px 20px' }}>
                      <div style={{ 
                        maxWidth: '400px', 
                        margin: '0 auto',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          width: '80px',
                          height: '80px',
                          margin: '0 auto 20px',
                          background: '#f0f5ff',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <i className="la la-bell-slash" style={{ 
                            fontSize: '40px', 
                            color: '#1967d2',
                            opacity: 0.5
                          }}></i>
                        </div>
                        <h4 style={{ 
                          fontSize: '18px', 
                          fontWeight: '600',
                          color: '#333',
                          marginBottom: '10px'
                        }}>
                          No Notifications Yet
                        </h4>
                        <p style={{ 
                          fontSize: '14px',
                          color: '#666',
                          lineHeight: '1.6',
                          margin: 0
                        }}>
                          You don't have any notifications at the moment. 
                          We'll notify you when there's something new for you!
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  notifications.map((item) => (
                    <tr key={item.id} style={{ 
                      background: !item.is_read ? '#f8f9fa' : 'transparent' 
                    }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <div style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '10px',
                            background: item.iconBg || '#f0f5ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <i className={`la ${item.icon || 'la-bell'}`} style={{ 
                              fontSize: '20px', 
                              color: item.iconColor || '#1967d2'
                            }}></i>
                          </div>
                          <div>
                            <h5 style={{ 
                              margin: '0 0 5px 0', 
                              fontSize: '15px',
                              fontWeight: '600'
                            }}>
                              <a 
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleView(item.id);
                                }}
                                style={{ color: '#202124', cursor: 'pointer' }}
                              >
                                {item.title}
                              </a>
                            </h5>
                            <p style={{ 
                              margin: 0, 
                              color: '#696969',
                              fontSize: '14px'
                            }}>
                              {item.message}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ 
                          padding: '5px 12px',
                          borderRadius: '15px',
                          fontSize: '13px',
                          fontWeight: '500',
                          display: 'inline-block',
                          ...getCategoryStyle(item.category)
                        }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', color: '#696969' }}>
                        {formatDate(item.created_at)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {!item.is_read ? (
                          <span style={{ 
                            color: '#1967d2', 
                            fontWeight: '600',
                            fontSize: '14px'
                          }}>
                            <i className="la la-circle" style={{ fontSize: '8px', marginRight: '5px' }}></i>
                            New
                          </span>
                        ) : (
                          <span style={{ color: '#999', fontSize: '14px' }}>Read</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div className="option-box" style={{ justifyContent: 'center' }}>
                          <ul className="option-list">
                            <li>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleView(item.id);
                                }}
                                data-text="View"
                                className="action-link"
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'rgba(25, 103, 210, 0.1)';
                                  e.currentTarget.style.borderRadius = '4px';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'none';
                                }}
                                style={{ 
                                  display: 'inline-block',
                                  padding: '4px',
                                  transition: 'all 0.3s',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer'
                                }}
                              >
                                <span className="la la-eye" style={{ color: '#1967d2', fontSize: '16px' }}></span>
                              </button>
                            </li>
                            {!item.is_read && (
                              <li>
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleMarkAsRead(item.id);
                                  }}
                                  data-text="Mark as Read"
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(82, 196, 26, 0.1)';
                                    e.currentTarget.style.borderRadius = '4px';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'none';
                                  }}
                                  style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    cursor: 'pointer',
                                    padding: '4px',
                                    transition: 'all 0.3s'
                                  }}
                                >
                                  <span className="la la-check" style={{ color: '#52c41a', fontSize: '16px' }}></span>
                                </button>
                              </li>
                            )}
                            <li>
                              <button 
                                onClick={async (e) => {
                                  e.preventDefault();
                                  await handleDeleteFromList(item.id, item.title);
                                }}
                                data-text="Delete"
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'rgba(255, 77, 79, 0.1)';
                                  e.currentTarget.style.borderRadius = '4px';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'none';
                                }}
                                style={{ 
                                  background: 'none', 
                                  border: 'none', 
                                  cursor: 'pointer',
                                  padding: '4px',
                                  transition: 'all 0.3s'
                                }}
                              >
                                <span className="la la-trash" style={{ color: '#ff4d4f', fontSize: '16px' }}></span>
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* End table widget content */}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        confirmStyle={confirmState.confirmStyle}
        icon={confirmState.icon}
      />
    </>
  );
};

export default JobAlertsTable;

/* 
  Backend Integration Notes:
  
  Expected API endpoints:
  
  1. GET /api/notifications
     Query params: { filter: 'all' | 'unread' | 'job' | 'message' | 'alert' }
     Response: {
       data: [{
         id: number,
         type: string,
         title: string,
         message: string,
         fullMessage: string,
         icon: string,
         iconBg: string,
         iconColor: string,
         link: string,
         created_at: string,
         is_read: boolean,
         category: 'Job' | 'Message' | 'Alert',
         actionText: string,
         actionIcon: string,
         additionalInfo: object (optional)
       }]
     }
  
  2. PUT /api/notifications/:id/read
     Response: { success: boolean }
  
  3. DELETE /api/notifications/:id
     Response: { success: boolean }
*/
