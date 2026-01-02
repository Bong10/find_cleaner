'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = () => {
    toast.info('Settings will be available once backend is ready');
  };

  return (
    <div className="admin-settings">
      <div className="page-header">
        <div>
          <h2>Settings</h2>
          <p>Configure admin dashboard preferences</p>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <button 
            className={activeTab === 'general' ? 'active' : ''}
            onClick={() => setActiveTab('general')}
          >
            <span className="la la-cog"></span>
            General
          </button>
          <button 
            className={activeTab === 'notifications' ? 'active' : ''}
            onClick={() => setActiveTab('notifications')}
          >
            <span className="la la-bell"></span>
            Notifications
          </button>
          <button 
            className={activeTab === 'security' ? 'active' : ''}
            onClick={() => setActiveTab('security')}
          >
            <span className="la la-shield-alt"></span>
            Security
          </button>
          <button 
            className={activeTab === 'appearance' ? 'active' : ''}
            onClick={() => setActiveTab('appearance')}
          >
            <span className="la la-palette"></span>
            Appearance
          </button>
          <button 
            className={activeTab === 'integrations' ? 'active' : ''}
            onClick={() => setActiveTab('integrations')}
          >
            <span className="la la-plug"></span>
            Integrations
          </button>
        </div>

        <div className="settings-content">
          <div className="coming-soon-state">
            <div className="icon-wrapper">
              <span className="la la-tools"></span>
            </div>
            <h3>Settings Coming Soon</h3>
            <p>Admin configuration options are currently under development.</p>
            
            <div className="features-grid">
              <div className="feature-section">
                <h4>
                  <span className="la la-cog"></span>
                  General Settings
                </h4>
                <ul>
                  <li>Platform name & branding</li>
                  <li>Time zone configuration</li>
                  <li>Language preferences</li>
                  <li>Email configuration</li>
                </ul>
              </div>

              <div className="feature-section">
                <h4>
                  <span className="la la-bell"></span>
                  Notifications
                </h4>
                <ul>
                  <li>Email notifications</li>
                  <li>SMS alerts</li>
                  <li>Push notifications</li>
                  <li>Notification frequency</li>
                </ul>
              </div>

              <div className="feature-section">
                <h4>
                  <span className="la la-shield-alt"></span>
                  Security
                </h4>
                <ul>
                  <li>Two-factor authentication</li>
                  <li>Session timeout</li>
                  <li>IP whitelist</li>
                  <li>Security logs</li>
                </ul>
              </div>

              <div className="feature-section">
                <h4>
                  <span className="la la-palette"></span>
                  Appearance
                </h4>
                <ul>
                  <li>Theme customization</li>
                  <li>Color scheme</li>
                  <li>Logo upload</li>
                  <li>Dashboard layout</li>
                </ul>
              </div>

              <div className="feature-section">
                <h4>
                  <span className="la la-plug"></span>
                  Integrations
                </h4>
                <ul>
                  <li>Payment gateways</li>
                  <li>SMS providers</li>
                  <li>Email services</li>
                  <li>Third-party APIs</li>
                </ul>
              </div>

              <div className="feature-section">
                <h4>
                  <span className="la la-database"></span>
                  Backup & Recovery
                </h4>
                <ul>
                  <li>Automated backups</li>
                  <li>Data export</li>
                  <li>System restore</li>
                  <li>Backup schedule</li>
                </ul>
              </div>
            </div>

            <div className="status-badge">
              <span className="la la-code"></span>
              Waiting for backend settings endpoints
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-settings {
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

        .settings-container {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 24px;
        }

        .settings-sidebar {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          height: fit-content;
        }

        .settings-sidebar button {
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #4b5563;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
          text-align: left;
          margin-bottom: 4px;
        }

        .settings-sidebar button:hover {
          background: #f9fafb;
          color: #8b5cf6;
        }

        .settings-sidebar button.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .settings-sidebar button span {
          font-size: 18px;
        }

        .settings-content {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          min-height: 500px;
        }

        .coming-soon-state {
          padding: 60px 40px;
          text-align: center;
        }

        .icon-wrapper {
          width: 100px;
          height: 100px;
          margin: 0 auto 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 48px;
          color: white;
        }

        .coming-soon-state h3 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 12px;
        }

        .coming-soon-state > p {
          font-size: 16px;
          color: #6b7280;
          margin: 0 0 40px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          text-align: left;
          margin-bottom: 40px;
        }

        .feature-section {
          padding: 24px;
          background: #f9fafb;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .feature-section h4 {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .feature-section h4 span {
          font-size: 20px;
          color: #8b5cf6;
        }

        .feature-section ul {
          margin: 0;
          padding: 0 0 0 20px;
        }

        .feature-section li {
          font-size: 14px;
          color: #4b5563;
          margin-bottom: 8px;
          line-height: 1.6;
        }

        .feature-section li:last-child {
          margin-bottom: 0;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #fef3c7;
          color: #92400e;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
        }

        @media (max-width: 968px) {
          .settings-container {
            grid-template-columns: 1fr;
          }

          .settings-sidebar {
            display: flex;
            overflow-x: auto;
            padding: 12px;
          }

          .settings-sidebar button {
            white-space: nowrap;
            margin-bottom: 0;
            margin-right: 8px;
          }
        }

        @media (max-width: 768px) {
          .admin-settings {
            padding: 20px;
          }

          .coming-soon-state {
            padding: 40px 20px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminSettings;
