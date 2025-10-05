"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import ConfirmModal, { useConfirm } from "../../../../common/ConfirmModal";
// Future: import { getNotification } from '@/services/cleanerService';

const NotificationDetails = ({ notifications, onMarkAsRead, onDelete }) => {
  const search = useSearchParams();
  const router = useRouter();
  const notificationId = search.get("notification");
  const { confirmState, confirm, closeConfirm } = useConfirm();

  // Try to find notification from passed list first
  const cached = useMemo(
    () => notifications.find((n) => String(n.id) === String(notificationId)),
    [notifications, notificationId]
  );

  const [notification, setNotification] = useState(cached || null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState("");

  // Fetch notification if not in cache
  const notificationFetched = useRef(false);
  useEffect(() => {
    if (notification || notificationFetched.current || !notificationId) return;
    notificationFetched.current = true;
    
    (async () => {
      try {
        setLoading(true);
        
        // TODO: Uncomment when backend endpoint is ready
        // const { data } = await getNotification(notificationId);
        // if (data) {
        //   setNotification(data);
        // } else {
        //   setError("Notification not found");
        // }
        
        // For now, since there's no data, show not found
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        setError("Notification not found");
        
      } catch (err) {
        console.error('Error fetching notification:', err);
        setError("Failed to load notification details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [cached, notificationId]);

  // Mark as read when viewing (only once)
  useEffect(() => {
    if (notification && !notification.is_read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  }, [notification?.id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const handleDelete = async (e) => {
    e.preventDefault();
    
    const shouldDelete = await confirm({
      title: "Delete Notification",
      message: `Are you sure you want to delete this notification? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmStyle: "danger",
      icon: "la-trash"
    });

    if (shouldDelete) {
      onDelete(notification.id);
      router.push('/candidates-dashboard/job-alerts');
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    router.push('/candidates-dashboard/job-alerts');
  };

  const handleAction = (e) => {
    e.preventDefault();
    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <>
      <div className="ls-widget">
        <div className="tabs-box">
          <div
            className="widget-title"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <h4>Notification Details</h4>
            <button 
              onClick={handleBack}
              className="theme-btn btn-style-three"
              style={{ cursor: 'pointer' }}
            >
              ← Back to All Notifications
            </button>
          </div>

          <div className="widget-content">
            {loading ? (
              <div style={{ padding: '80px 20px', textAlign: 'center' }}>
                <i className="la la-spinner la-spin" style={{ 
                  fontSize: '32px', 
                  color: '#1967d2',
                  marginBottom: '15px',
                  display: 'block'
                }}></i>
                <p style={{ fontSize: '16px', color: '#666' }}>Loading notification details...</p>
              </div>
            ) : error ? (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 20px',
                  background: '#fee',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="la la-exclamation-triangle" style={{ 
                    fontSize: '40px', 
                    color: '#dc3545'
                  }}></i>
                </div>
                <h4 style={{ 
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '10px'
                }}>
                  {error}
                </h4>
                <p style={{ 
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '20px'
                }}>
                  The notification you're looking for might have been deleted or doesn't exist.
                </p>
                <button 
                  onClick={handleBack}
                  className="theme-btn btn-style-one"
                  style={{ cursor: 'pointer' }}
                >
                  Back to Notifications
                </button>
              </div>
            ) : notification ? (
              <>
                {/* Notification Header Card */}
                <div className="job-block" style={{ 
                  border: "1px solid #EEF2FF", 
                  borderRadius: 8,
                  padding: '20px',
                  marginBottom: '20px'
                }}>
                  <div className="inner-box">
                    <div className="content" style={{ display: "flex", alignItems: "flex-start", gap: '20px' }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        background: notification.iconBg || '#f0f5ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <i className={`la ${notification.icon || 'la-bell'}`} style={{ 
                          fontSize: '28px', 
                          color: notification.iconColor || '#1967d2'
                        }}></i>
                      </div>

                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>{notification.title}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <span style={{ 
                            padding: '5px 12px',
                            borderRadius: '15px',
                            fontSize: '13px',
                            fontWeight: '500',
                            ...getCategoryStyle(notification.category)
                          }}>
                            {notification.category}
                          </span>
                          <span style={{ color: '#696969', fontSize: '14px' }}>
                            <i className="la la-clock-o" style={{ marginRight: '5px' }}></i>
                            {formatDate(notification.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Content */}
                <div style={{ 
                  border: "1px solid #EEF2FF", 
                  borderRadius: 8,
                  padding: '25px'
                }}>
                  <p style={{ 
                    fontSize: '16px', 
                    lineHeight: '1.8', 
                    color: '#333',
                    marginBottom: notification.additionalInfo ? '20px' : '30px'
                  }}>
                    {notification.fullMessage}
                  </p>

                  {/* Additional Info if available */}
                  {notification.additionalInfo && (
                    <div style={{
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      padding: '20px',
                      marginBottom: '30px'
                    }}>
                      <h5 style={{ 
                        marginBottom: '15px', 
                        color: '#333', 
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <i className="la la-info-circle" style={{ marginRight: '8px', fontSize: '18px' }}></i>
                        Details
                      </h5>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                        {Object.entries(notification.additionalInfo).map(([key, value]) => (
                          <div key={key} style={{ display: 'flex', fontSize: '14px' }}>
                            <strong style={{ 
                              marginRight: '8px',
                              color: '#555',
                              minWidth: '120px'
                            }}>
                              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}:
                            </strong>
                            <span style={{ color: '#777' }}>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
                    {notification.link && (
                      <button 
                        onClick={handleAction}
                        className="theme-btn btn-style-one"
                        style={{ cursor: 'pointer' }}
                      >
                        <i className={`la ${notification.actionIcon || 'la-arrow-right'}`} style={{ marginRight: '5px' }}></i>
                        {notification.actionText || 'Take Action'}
                      </button>
                    )}
                    <button 
                      onClick={handleDelete}
                      className="theme-btn btn-style-three"
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="la la-trash" style={{ marginRight: '5px' }}></i>
                      Delete
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
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
                  Notification Not Found
                </h4>
                <p style={{ 
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '20px'
                }}>
                  This notification doesn't exist or may have been removed.
                </p>
                <button 
                  onClick={handleBack}
                  className="theme-btn btn-style-one"
                  style={{ cursor: 'pointer' }}
                >
                  Back to Notifications
                </button>
              </div>
            )}
          </div>
        </div>
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

export default NotificationDetails;

/* 
  Backend Integration Notes:
  
  Expected API endpoint: GET /api/notifications/:id
  
  Response format:
  {
    data: {
      id: number,
      type: string,
      title: string,
      message: string,
      fullMessage: string,
      icon: string,
      iconBg: string,
      iconColor: string,
      link: string,
      actionText: string,
      actionIcon: string,
      created_at: string,
      is_read: boolean,
      category: 'Job' | 'Message' | 'Alert',
      additionalInfo: {
        // Dynamic fields based on notification type
      }
    }
  }
*/