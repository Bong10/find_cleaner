'use client';

import { useState } from 'react';

const AdminReports = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="admin-reports-container">
      {/* Page Header */}
      <div className="reports-header">
        <div className="header-left">
          <h1>Reports & Analytics</h1>
          <p>Comprehensive insights and performance metrics</p>
        </div>
        <div className="header-right">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} disabled className="time-select">
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="export-btn" disabled>
            <span className="la la-download"></span>
            Export Report
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="reports-tabs">
        <button 
          className={`report-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="la la-chart-pie"></span>
          <span>Overview</span>
        </button>
        <button 
          className={`report-tab ${activeTab === 'revenue' ? 'active' : ''}`}
          onClick={() => setActiveTab('revenue')}
        >
          <span className="la la-money-bill-wave"></span>
          <span>Revenue</span>
        </button>
        <button 
          className={`report-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <span className="la la-users"></span>
          <span>Users</span>
        </button>
        <button 
          className={`report-tab ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          <span className="la la-calendar-check"></span>
          <span>Bookings</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content-wrapper">
        {activeTab === 'overview' && (
          <div className="overview-content">
            {/* Stats Cards */}
            <div className="stats-row">
              <div className="metric-card purple-card">
                <div className="metric-icon purple-bg">
                  <span className="la la-pound-sign"></span>
                </div>
                <div className="metric-info">
                  <span className="metric-label">Total Revenue</span>
                  <span className="metric-value">£0.00</span>
                  <span className="metric-trend">
                    <span className="la la-arrow-up"></span> Coming Soon
                  </span>
                </div>
              </div>

              <div className="metric-card blue-card">
                <div className="metric-icon blue-bg">
                  <span className="la la-users"></span>
                </div>
                <div className="metric-info">
                  <span className="metric-label">Total Users</span>
                  <span className="metric-value">0</span>
                  <span className="metric-trend">
                    <span className="la la-arrow-up"></span> Coming Soon
                  </span>
                </div>
              </div>

              <div className="metric-card green-card">
                <div className="metric-icon green-bg">
                  <span className="la la-calendar-check"></span>
                </div>
                <div className="metric-info">
                  <span className="metric-label">Total Bookings</span>
                  <span className="metric-value">0</span>
                  <span className="metric-trend">
                    <span className="la la-arrow-up"></span> Coming Soon
                  </span>
                </div>
              </div>

              <div className="metric-card orange-card">
                <div className="metric-icon orange-bg">
                  <span className="la la-star"></span>
                </div>
                <div className="metric-info">
                  <span className="metric-label">Average Rating</span>
                  <span className="metric-value">0.0</span>
                  <span className="metric-trend">
                    <span className="la la-arrow-up"></span> Coming Soon
                  </span>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="charts-row">
              <div className="chart-container">
                <div className="chart-header">
                  <h3>Revenue Trends</h3>
                  <span className="la la-chart-line"></span>
                </div>
                <div className="chart-body">
                  <div className="chart-empty">
                    <span className="la la-chart-area"></span>
                    <p>Revenue chart will appear here</p>
                  </div>
                </div>
              </div>

              <div className="chart-container">
                <div className="chart-header">
                  <h3>User Growth</h3>
                  <span className="la la-chart-bar"></span>
                </div>
                <div className="chart-body">
                  <div className="chart-empty">
                    <span className="la la-chart-bar"></span>
                    <p>User growth chart will appear here</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="info-banner">
              <div className="info-icon-wrapper">
                <span className="la la-info-circle"></span>
              </div>
              <div className="info-text">
                <h4>Analytics Features Coming Soon</h4>
                <p>We're building comprehensive analytics to help you understand your business better. Stay tuned!</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="category-content">
            <div className="category-empty">
              <div className="category-icon">
                <span className="la la-money-bill-wave"></span>
              </div>
              <h2>Revenue Analytics</h2>
              <p>Detailed revenue reports and financial insights</p>
              
              <div className="feature-grid">
                <div className="feature-box">
                  <span className="la la-chart-line"></span>
                  <span>Revenue trends over time</span>
                </div>
                <div className="feature-box">
                  <span className="la la-coins"></span>
                  <span>Income breakdown by service</span>
                </div>
                <div className="feature-box">
                  <span className="la la-receipt"></span>
                  <span>Transaction history</span>
                </div>
                <div className="feature-box">
                  <span className="la la-file-invoice-dollar"></span>
                  <span>Payment analytics</span>
                </div>
              </div>

              <div className="dev-badge">
                <span className="la la-clock"></span>
                Under Development
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="category-content">
            <div className="category-empty">
              <div className="category-icon">
                <span className="la la-users"></span>
              </div>
              <h2>User Analytics</h2>
              <p>Track user registration, engagement, and retention metrics</p>
              
              <div className="feature-grid">
                <div className="feature-box">
                  <span className="la la-user-plus"></span>
                  <span>New user registrations</span>
                </div>
                <div className="feature-box">
                  <span className="la la-chart-pie"></span>
                  <span>User type distribution</span>
                </div>
                <div className="feature-box">
                  <span className="la la-user-clock"></span>
                  <span>Active vs inactive users</span>
                </div>
                <div className="feature-box">
                  <span className="la la-map-marker"></span>
                  <span>Geographic distribution</span>
                </div>
              </div>

              <div className="dev-badge">
                <span className="la la-clock"></span>
                Under Development
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="category-content">
            <div className="category-empty">
              <div className="category-icon">
                <span className="la la-calendar-check"></span>
              </div>
              <h2>Booking Analytics</h2>
              <p>Comprehensive booking statistics and performance metrics</p>
              
              <div className="feature-grid">
                <div className="feature-box">
                  <span className="la la-calendar-alt"></span>
                  <span>Booking volume trends</span>
                </div>
                <div className="feature-box">
                  <span className="la la-clock"></span>
                  <span>Peak booking times</span>
                </div>
                <div className="feature-box">
                  <span className="la la-percentage"></span>
                  <span>Completion rates</span>
                </div>
                <div className="feature-box">
                  <span className="la la-tasks"></span>
                  <span>Service popularity</span>
                </div>
              </div>

              <div className="dev-badge">
                <span className="la la-clock"></span>
                Under Development
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-reports-container {
          padding: 30px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        /* Header */
        .reports-header {
          background: white;
          border-radius: 12px;
          padding: 24px 28px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          flex-wrap: wrap;
          gap: 20px;
        }

        .header-left h1 {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 6px 0;
        }

        .header-left p {
          font-size: 15px;
          color: #6b7280;
          margin: 0;
        }

        .header-right {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .time-select {
          height: 42px;
          padding: 0 36px 0 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          background: white;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .export-btn {
          height: 42px;
          padding: 0 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: not-allowed;
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0.5;
        }

        .export-btn span {
          font-size: 16px;
        }

        /* Tabs */
        .reports-tabs {
          background: white;
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 24px;
          display: flex;
          gap: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          flex-wrap: wrap;
        }

        .report-tab {
          padding: 12px 24px;
          border: 2px solid #e5e7eb;
          background: white;
          color: #6b7280;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .report-tab:hover {
          border-color: #667eea;
          color: #667eea;
        }

        .report-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
        }

        .report-tab span:first-child {
          font-size: 18px;
        }

        /* Tab Content Wrapper */
        .tab-content-wrapper {
          min-height: 400px;
        }

        /* Overview Content */
        .overview-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Stats Row */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .metric-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease;
        }

        .metric-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        }

        .metric-icon {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          color: white;
          flex-shrink: 0;
        }

        .purple-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .blue-bg {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .green-bg {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .orange-bg {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .metric-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .metric-label {
          font-size: 13px;
          font-weight: 700;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric-value {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
        }

        .metric-trend {
          font-size: 13px;
          color: #667eea;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Charts Row */
        .charts-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 20px;
        }

        .chart-container {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f3f4f6;
        }

        .chart-header h3 {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .chart-header span {
          font-size: 24px;
          color: #667eea;
        }

        .chart-body {
          height: 250px;
        }

        .chart-empty {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          border-radius: 8px;
          border: 2px dashed #e5e7eb;
        }

        .chart-empty span {
          font-size: 48px;
          color: #d1d5db;
          margin-bottom: 12px;
        }

        .chart-empty p {
          font-size: 14px;
          color: #9ca3af;
          margin: 0;
        }

        /* Info Banner */
        .info-banner {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 2px solid #fbbf24;
          border-radius: 12px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .info-icon-wrapper {
          width: 48px;
          height: 48px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #f59e0b;
          flex-shrink: 0;
        }

        .info-text h4 {
          font-size: 16px;
          font-weight: 700;
          color: #92400e;
          margin: 0 0 6px 0;
        }

        .info-text p {
          font-size: 14px;
          color: #92400e;
          margin: 0;
        }

        /* Category Content */
        .category-content {
          background: white;
          border-radius: 12px;
          padding: 48px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .category-empty {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .category-icon {
          width: 100px;
          height: 100px;
          margin: 0 auto 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          color: white;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
        }

        .category-empty h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 12px 0;
        }

        .category-empty > p {
          font-size: 16px;
          color: #6b7280;
          margin: 0 0 32px 0;
        }

        /* Feature Grid */
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .feature-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 20px;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .feature-box:hover {
          transform: translateY(-4px);
          border-color: #667eea;
          background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
        }

        .feature-box span:first-child {
          font-size: 32px;
          color: #667eea;
        }

        .feature-box span:last-child {
          font-size: 14px;
          color: #4b5563;
          font-weight: 600;
          text-align: center;
        }

        /* Dev Badge */
        .dev-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          border: 2px solid #fbbf24;
        }

        .dev-badge span {
          font-size: 18px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .admin-reports-container {
            padding: 20px;
          }

          .reports-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-right {
            width: 100%;
            flex-direction: column;
          }

          .time-select,
          .export-btn {
            width: 100%;
            justify-content: center;
          }

          .reports-tabs {
            flex-direction: column;
          }

          .report-tab {
            width: 100%;
            justify-content: center;
          }

          .stats-row {
            grid-template-columns: 1fr;
          }

          .charts-row {
            grid-template-columns: 1fr;
          }

          .category-content {
            padding: 24px;
          }

          .feature-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminReports;
