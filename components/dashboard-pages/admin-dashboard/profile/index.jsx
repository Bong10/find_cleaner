'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AdminProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        phone: user.phone_number || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    toast.info('Profile update will be available once backend endpoint is ready');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        email: user.email || '',
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        phone: user.phone_number || '',
      });
    }
  };

  return (
    <div className="admin-profile">
      <div className="page-header">
        <div>
          <h2>My Profile</h2>
          <p>Manage your admin account information</p>
        </div>
        {!isEditing && (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            <span className="la la-edit"></span>
            Edit Profile
          </button>
        )}
      </div>

      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-large">
              <span className="la la-user-shield"></span>
            </div>
            <div className="profile-title">
              <h3>{user?.email?.split('@')[0] || 'Admin'}</h3>
              <p className="role-badge">
                <span className="la la-shield-alt"></span>
                System Administrator
              </p>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div className="form-section">
              <h4>Basic Information</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-with-icon">
                    <span className="la la-envelope"></span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <div className="input-with-icon">
                    <span className="la la-user"></span>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter first name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <div className="input-with-icon">
                    <span className="la la-user"></span>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <div className="input-with-icon">
                    <span className="la la-phone"></span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCancel}>
                  <span className="la la-times"></span>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  <span className="la la-save"></span>
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Account Info Card */}
        <div className="info-cards">
          <div className="info-card">
            <div className="info-icon">
              <span className="la la-calendar"></span>
            </div>
            <div className="info-content">
              <h5>Account Created</h5>
              <p>{user?.date_joined ? new Date(user.date_joined).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'N/A'}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <span className="la la-clock"></span>
            </div>
            <div className="info-content">
              <h5>Last Login</h5>
              <p>{user?.last_login ? new Date(user.last_login).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'N/A'}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <span className="la la-shield-alt"></span>
            </div>
            <div className="info-content">
              <h5>Account Status</h5>
              <p className="status-active">
                <span className="status-dot"></span>
                Active
              </p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <span className="la la-user-shield"></span>
            </div>
            <div className="info-content">
              <h5>Role</h5>
              <p>Administrator</p>
            </div>
          </div>

          {/* Security Section */}
          <div className="security-card">
            <h4>
              <span className="la la-lock"></span>
              Security & Access
            </h4>
            <div className="security-items">
              <div className="security-item">
                <div className="security-item-icon">
                  <span className="la la-key"></span>
                </div>
                <div className="security-item-content">
                  <h5>Password</h5>
                  <p>Last changed 30 days ago</p>
                </div>
                <button className="security-item-action" onClick={() => toast.info('Password change will be available soon')}>
                  Change
                </button>
              </div>

              <div className="security-item">
                <div className="security-item-icon">
                  <span className="la la-mobile"></span>
                </div>
                <div className="security-item-content">
                  <h5>Two-Factor Authentication</h5>
                  <p>Not enabled</p>
                </div>
                <button className="security-item-action" onClick={() => toast.info('2FA setup will be available soon')}>
                  Enable
                </button>
              </div>

              <div className="security-item">
                <div className="security-item-icon">
                  <span className="la la-history"></span>
                </div>
                <div className="security-item-content">
                  <h5>Login History</h5>
                  <p>View your recent login activity</p>
                </div>
                <button className="security-item-action" onClick={() => toast.info('Login history will be available soon')}>
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-profile {
          padding: 30px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
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

        .edit-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .edit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .profile-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .profile-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 32px;
        }

        .profile-header {
          text-align: center;
          padding-bottom: 32px;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 32px;
        }

        .profile-avatar-large {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: grid;
          place-items: center;
          color: white;
          font-size: 56px;
          margin: 0 auto 16px;
        }

        .profile-title h3 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px;
          text-transform: capitalize;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          margin: 0;
        }

        .form-section {
          margin-bottom: 24px;
        }

        .form-section h4 {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 8px;
        }

        .input-with-icon {
          position: relative;
        }

        .input-with-icon span {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 18px;
          color: #9ca3af;
        }

        .input-with-icon input {
          width: 100%;
          padding: 12px 16px 12px 45px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .input-with-icon input:focus {
          outline: none;
          border-color: #8b5cf6;
        }

        .input-with-icon input:disabled {
          background: #f9fafb;
          cursor: not-allowed;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .btn-cancel,
        .btn-save {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel {
          background: #f3f4f6;
          color: #4b5563;
          border: 1px solid #e5e7eb;
        }

        .btn-cancel:hover {
          background: #e5e7eb;
        }

        .btn-save {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
        }

        .btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .info-cards {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .info-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .info-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: grid;
          place-items: center;
          color: white;
          font-size: 24px;
          flex-shrink: 0;
        }

        .info-content h5 {
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          margin: 0 0 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-content p {
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .status-active {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #059669 !important;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #059669;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .security-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }

        .security-card h4 {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .security-items {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .security-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .security-item-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: white;
          display: grid;
          place-items: center;
          color: #8b5cf6;
          font-size: 20px;
          flex-shrink: 0;
        }

        .security-item-content {
          flex: 1;
        }

        .security-item-content h5 {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px;
        }

        .security-item-content p {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
        }

        .security-item-action {
          padding: 8px 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #8b5cf6;
          cursor: pointer;
          transition: all 0.2s;
        }

        .security-item-action:hover {
          background: #8b5cf6;
          color: white;
          border-color: #8b5cf6;
        }

        @media (max-width: 1200px) {
          .profile-content {
            grid-template-columns: 1fr;
          }

          .info-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }

          .security-card {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 768px) {
          .admin-profile {
            padding: 20px;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .info-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminProfile;
