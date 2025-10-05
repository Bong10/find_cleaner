import Link from "next/link";
import { useEffect, useState } from 'react';
// Future: import { getNotifications } from '@/services/cleanerService';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // TODO: Uncomment when backend endpoint is ready
      // const response = await getNotifications();
      // const data = response?.data || [];
      // setNotifications(data);
      
      // For now, use default notifications for cleaners
      // To test empty state, set this to []
      const defaultNotifications = [
        // {
        //   id: 1,
        //   icon: "flaticon-briefcase",
        //   text: "New cleaning job in ",
        //   highlight: "Downtown Office",
        //   time: "1 hour ago",
        // },
        // {
        //   id: 2,
        //   icon: "flaticon-bookmark",
        //   text: "Employer saved your ",
        //   highlight: "Cleaner Profile",
        //   time: "2 hours ago",
        // },
        // {
        //   id: 3,
        //   icon: "flaticon-envelope",
        //   text: "Message about ",
        //   highlight: "House Cleaning Job",
        //   time: "3 hours ago",
        // },
        // {
        //   id: 4,
        //   icon: "flaticon-eye",
        //   text: "Your application viewed for ",
        //   highlight: "Office Cleaning",
        //   time: "5 hours ago",
        // },
        // {
        //   id: 5,
        //   icon: "flaticon-bell",
        //   text: "Job match: ",
        //   highlight: "Hotel Housekeeping",
        //   time: "1 day ago",
        // },
      ];

      setNotifications(defaultNotifications);
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // On error, set empty array to show "no notifications" message
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="widget-title">
        <h4>Notifications</h4>
      </div>
      <div className="widget-content">
        <ul className="notification-list">
          {notifications.length === 0 ? (
            <li style={{ 
              textAlign: 'center', 
              padding: '20px',
              color: '#999' 
            }}>
              <span 
                style={{ 
                  fontSize: '24px',
                  marginRight: '10px',
                  opacity: '0.5'
                }}
              ></span>
              No notifications available
            </li>
          ) : (
            notifications.map((item) => (
              <li key={item.id}>
                <span 
                  className={`icon ${item.icon}`}
                  style={{ 
                    fontSize: '18px',
                    marginRight: '10px',
                  }}
                ></span>
                {item.text}
                <strong>{item.highlight}</strong>
                {' '}
                <Link href="#" className="colored" style={{ marginLeft: '5px' }}>
                  {item.time}
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
};

export default Notification;

/* 
  Backend Integration Notes:
  
  Expected API endpoint: GET /api/notifications/
  
  Expected response format:
  {
    data: [
      {
        id: 1,
        icon: "flaticon-briefcase",
        text: "New cleaning job in ",
        highlight: "Downtown Office",
        time: "1 hour ago"
      }
    ]
  }
*/
