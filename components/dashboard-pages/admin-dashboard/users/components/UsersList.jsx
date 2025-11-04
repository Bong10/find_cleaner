'use client';

const UsersList = ({ 
  users, 
  loading, 
  onView, 
  onEdit, 
  onChangeRole, 
  onToggleStatus, 
  onDelete 
}) => {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="empty-state">
        <span className="la la-user-slash"></span>
        <h3>No users found</h3>
        <p>Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="users-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Type</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Profile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={`${user.type}-${user.id}`}>
              <td>
                <div className="user-info">
                  <div className="user-avatar">
                    <span className="la la-user"></span>
                  </div>
                  <div>
                    <div className="user-name">
                      {user.type === 'employer' 
                        ? (user.business_name || user.company_name || user.name || 'N/A')
                        : (user.name || 'N/A')
                      }
                    </div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
              </td>
              <td>
                <span className={`type-badge ${user.type}`}>
                  <span className={`la ${user.type === 'cleaner' ? 'la-user-tie' : 'la-briefcase'}`}></span>
                  {user.type}
                </span>
              </td>
              <td>
                <div className="contact-info">
                  {user.phone_number || 'N/A'}
                </div>
              </td>
              <td>
                <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                {user.date_joined 
                  ? new Date(user.date_joined).toLocaleDateString()
                  : 'N/A'
                }
              </td>
              <td>
                <span className={`profile-badge ${user.profile_completed ? 'completed' : 'incomplete'}`}>
                  {user.profile_completed ? 'Complete' : 'Incomplete'}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn-action view"
                    onClick={() => onView(user)}
                    title="View Details"
                  >
                    <span className="la la-eye"></span>
                  </button>
                  <button
                    className="btn-action edit"
                    onClick={() => onEdit(user)}
                    title="Edit User"
                  >
                    <span className="la la-edit"></span>
                  </button>
                  <button
                    className="btn-action role"
                    onClick={() => onChangeRole(user)}
                    title="Change Role"
                  >
                    <span className="la la-user-tag"></span>
                  </button>
                  <button
                    className={`btn-action ${user.is_active ? 'deactivate' : 'activate'}`}
                    onClick={() => onToggleStatus(user)}
                    title={user.is_active ? 'Deactivate' : 'Activate'}
                  >
                    <span className={`la ${user.is_active ? 'la-ban' : 'la-check-circle'}`}></span>
                  </button>
                  <button
                    className="btn-action delete"
                    onClick={() => onDelete(user)}
                    title="Delete User"
                  >
                    <span className="la la-trash"></span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
