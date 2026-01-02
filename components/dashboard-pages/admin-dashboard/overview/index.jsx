'use client';

import { useEffect, useState } from 'react';
import AdminService from '@/services/adminService';
import { toast } from 'react-toastify';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    total_cleaners: 0,
    total_employers: 0,
    total_services: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await AdminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Cleaners',
      value: stats.total_cleaners || 0,
      icon: 'la-user-tie',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      link: '/admin-dashboard/cleaners',
    },
    {
      title: 'Total Employers',
      value: stats.total_employers || 0,
      icon: 'la-briefcase',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      link: '/admin-dashboard/employers',
    },
    {
      title: 'Total Services',
      value: stats.total_services || 0,
      icon: 'la-concierge-bell',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      link: '/admin-dashboard/services',
    },
    {
      title: 'Active Jobs',
      value: stats.total_jobs || 0,
      icon: 'la-file-alt',
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
      link: '/admin-dashboard/jobs',
    },
  ];

  return (
    <div className="admin-overview">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome to the Find Cleaner Admin Portal</p>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading statistics...</p>
        </div>
      ) : (
        <div className="stats-grid">
          {statCards.map((card, idx) => (
            <a 
              key={idx} 
              href={card.link}
              className="stat-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="stat-icon" style={{ background: card.bgColor, color: card.color }}>
                <span className={`la ${card.icon}`}></span>
              </div>
              <div className="stat-content">
                <h3>{card.value.toLocaleString()}</h3>
                <p>{card.title}</p>
              </div>
            </a>
          ))}
        </div>
      )}

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <a href="/admin-dashboard/cleaners" className="action-card">
            <span className="la la-user-tie"></span>
            <span>Manage Cleaners</span>
          </a>
          <a href="/admin-dashboard/employers" className="action-card">
            <span className="la la-briefcase"></span>
            <span>Manage Employers</span>
          </a>
          <a href="/admin-dashboard/services" className="action-card">
            <span className="la la-concierge-bell"></span>
            <span>Manage Services</span>
          </a>
          <a href="/admin-dashboard/chats" className="action-card">
            <span className="la la-comments"></span>
            <span>Chat Moderation</span>
          </a>
        </div>
      </div>

      <style jsx>{`
        .admin-overview {
          padding: 30px;
        }

        .dashboard-header {
          margin-bottom: 30px;
        }

        .dashboard-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px;
        }

        .dashboard-header p {
          font-size: 15px;
          color: #6b7280;
          margin: 0;
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s;
        }

        .stat-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          font-size: 28px;
        }

        .stat-content h3 {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px;
        }

        .stat-content p {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .quick-actions {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
        }

        .quick-actions h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 20px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .action-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          text-decoration: none;
          color: #374151;
          font-weight: 500;
          transition: all 0.2s;
        }

        .action-card:hover {
          background: #8b5cf6;
          border-color: #8b5cf6;
          color: white;
          transform: translateX(4px);
        }

        .action-card span:first-child {
          font-size: 24px;
        }

        @media (max-width: 768px) {
          .admin-overview {
            padding: 20px;
          }

          .dashboard-header h2 {
            font-size: 24px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminOverview;
