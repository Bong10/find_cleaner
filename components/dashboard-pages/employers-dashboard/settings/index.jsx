'use client';

import { useState } from 'react';
import MobileMenu from '../../../header/MobileMenu';
import DashboardHeader from '../../../header/DashboardHeader';
import LoginPopup from '../../../common/form/login/LoginPopup';
import DashboardEmployerSidebar from '../../../header/DashboardEmployerSidebar';
import BreadCrumb from '../../BreadCrumb';
import CopyrightFooter from '../../CopyrightFooter';
import MenuToggler from '../../MenuToggler';
import NotificationSettings from '../notification-settings';

const EmployerSettings = () => {
  const [activeTab, setActiveTab] = useState('notifications');

  return (
    <div className="page-wrapper dashboard">
      <LoginPopup />
      <DashboardHeader />
      <MobileMenu />
      <DashboardEmployerSidebar />

      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="Settings" />
          <MenuToggler />

          <div className="row">
            <div className="col-lg-12">
              <div className="ls-widget">
                <div className="tabs-box">
                  <div className="widget-title">
                    <h4>Settings</h4>
                  </div>

                  <div className="widget-content">
                    <div className="settings-tabs">
                      <button
                        type="button"
                        className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notifications')}
                      >
                        <i className="la la-bell"></i>
                        <span>Notification Settings</span>
                      </button>
                      <button
                        type="button"
                        className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
                        onClick={() => setActiveTab('account')}
                      >
                        <i className="la la-user"></i>
                        <span>Account Settings</span>
                      </button>
                      <button
                        type="button"
                        className={`settings-tab ${activeTab === 'privacy' ? 'active' : ''}`}
                        onClick={() => setActiveTab('privacy')}
                      >
                        <i className="la la-shield-alt"></i>
                        <span>Privacy & Security</span>
                      </button>
                    </div>

                    <div className="settings-tab-content">
                      {activeTab === 'notifications' && <NotificationSettings />}
                      {activeTab === 'account' && <AccountSettings />}
                      {activeTab === 'privacy' && <PrivacySettings />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End .row */}
        </div>
        {/* End dashboard-outer */}
      </section>

      <CopyrightFooter />

      <style jsx>{`
        .settings-tabs {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          padding: 0 30px;
          overflow-x: auto;
          background: #f8f9fa;
        }

        .settings-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 18px 24px;
          border: none;
          background: transparent;
          color: #696969;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .settings-tab i {
          font-size: 20px;
        }

        .settings-tab:hover {
          color: #1967d2;
        }

        .settings-tab.active {
          color: #1967d2;
          border-bottom-color: #1967d2;
        }

        .settings-tab-content {
          padding: 0;
        }

        @media (max-width: 768px) {
          .settings-tabs {
            padding: 0 15px;
          }

          .settings-tab {
            padding: 16px 16px;
            font-size: 14px;
          }

          .settings-tab span {
            display: none;
          }

          .settings-tab i {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
};

const AccountSettings = () => (
  <div style={{ padding: '30px' }}>
    <h4 style={{ marginBottom: 8 }}>Account Settings</h4>
    <p style={{ margin: 0, color: '#696969' }}>Account settings will be available soon.</p>
  </div>
);

const PrivacySettings = () => (
  <div style={{ padding: '30px' }}>
    <h4 style={{ marginBottom: 8 }}>Privacy & Security</h4>
    <p style={{ margin: 0, color: '#696969' }}>Privacy and security settings will be available soon.</p>
  </div>
);

export default EmployerSettings;
