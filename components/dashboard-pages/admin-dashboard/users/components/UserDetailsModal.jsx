'use client';

const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>User Details</h3>
          <button className="close-btn" onClick={onClose}>
            <span className="la la-times"></span>
          </button>
        </div>
        <div className="modal-body">
          <div className="user-details">
            <div className="detail-section">
              <h4>Basic Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>{user.type === 'employer' ? 'Business Name:' : 'Name:'}</label>
                  <span>
                    {user.type === 'employer' 
                      ? (user.business_name || user.company_name || user.name || 'N/A')
                      : (user.name || 'N/A')
                    }
                  </span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{user.email}</span>
                </div>
                <div className="detail-item">
                  <label>Phone:</label>
                  <span>{user.phone_number || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Address:</label>
                  <span>{user.address || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>User Type:</label>
                  <span className={`type-badge ${user.type}`}>
                    {user.type}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Status:</label>
                  <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Date Joined:</label>
                  <span>{user.date_joined ? new Date(user.date_joined).toLocaleString() : 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Last Login:</label>
                  <span>{user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}</span>
                </div>
              </div>
            </div>

            {user.type === 'cleaner' && (
              <div className="detail-section">
                <h4>Cleaner Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Clean Level:</label>
                    <span>{user.clean_level || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Experience:</label>
                    <span>{user.experience_years || 0} years</span>
                  </div>
                  <div className="detail-item">
                    <label>Hourly Rate:</label>
                    <span>${user.hourly_rate || 0}/hr</span>
                  </div>
                  <div className="detail-item">
                    <label>Availability:</label>
                    <span>{user.availability || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Rating:</label>
                    <span>⭐ {user.rating || 0}</span>
                  </div>
                  <div className="detail-item">
                    <label>Jobs Completed:</label>
                    <span>{user.jobs_completed || 0}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Bio:</label>
                    <span>{user.bio || 'No bio provided'}</span>
                  </div>
                </div>
              </div>
            )}

            {user.type === 'employer' && (
              <div className="detail-section">
                <h4>Employer Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Business Type:</label>
                    <span>{user.business_type || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Verified:</label>
                    <span className={`status-badge ${user.verified ? 'active' : 'inactive'}`}>
                      {user.verified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Jobs Posted:</label>
                    <span>{user.jobs_posted || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
