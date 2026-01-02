'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AdminService from '@/services/adminService';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [viewModal, setViewModal] = useState({ show: false, user: null });
  const [editModal, setEditModal] = useState({ show: false, user: null });
  const [roleModal, setRoleModal] = useState({ show: false, user: null });
  const [deleteModal, setDeleteModal] = useState({ show: false, user: null });
  const [rolesManagementModal, setRolesManagementModal] = useState(false);
  
  // Form state
  const [editForm, setEditForm] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const [cleanersData, employersData] = await Promise.all([
        AdminService.getAllCleaners(),
        AdminService.getAllEmployers()
      ]);

      // Handle both array and paginated response formats
      const cleaners = Array.isArray(cleanersData) ? cleanersData : cleanersData.results || [];
      const employers = Array.isArray(employersData) ? employersData : employersData.results || [];

      // Map users and flatten nested user object
      const allUsers = [
        ...cleaners.map(cleaner => ({
          ...cleaner,
          ...cleaner.user, // Flatten user fields from nested user object
          type: 'cleaner',
          role: 'Cleaner',
          cleaner_id: cleaner.id,
          id: cleaner.user?.id || cleaner.id // Use user.id as primary ID
        })),
        ...employers.map(employer => ({
          ...employer,
          ...employer.user, // Flatten user fields from nested user object
          type: 'employer',
          role: 'Employer',
          employer_id: employer.id,
          id: employer.user?.id || employer.id // Use user.id as primary ID
        }))
      ];

      setUsers(allUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Handle View User
  const handleViewUser = (user) => {
    setViewModal({ show: true, user });
  };

  // Handle Edit User
  const handleEditUser = (user) => {
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
      address: user.address || '',
      is_active: user.is_active || false,
      // Cleaner specific
      ...(user.type === 'cleaner' && {
        hourly_rate: user.hourly_rate || '',
        experience_years: user.experience_years || '',
        bio: user.bio || '',
        clean_level: user.clean_level || 'basic',
        availability: user.availability || 'full_time'
      }),
      // Employer specific
      ...(user.type === 'employer' && {
        business_name: user.business_name || user.company_name || '',
        business_type: user.business_type || 'residential',
        verified: user.verified || false
      })
    });
    setEditModal({ show: true, user });
  };

  // Handle Save Edit
  const handleSaveEdit = async () => {
    if (!editModal.user) return;

    setSubmitting(true);
    try {
      const updateFunction = editModal.user.type === 'cleaner' 
        ? AdminService.updateCleaner 
        : AdminService.updateEmployer;
      
      // Use cleaner_id or employer_id for the API call
      const recordId = editModal.user.type === 'cleaner' 
        ? editModal.user.cleaner_id 
        : editModal.user.employer_id;
      
      await updateFunction(recordId, editForm);
      
      toast.success(`${editModal.user.type} updated successfully`);
      setEditModal({ show: false, user: null });
      fetchAllUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Change Role
  const handleChangeRole = (user) => {
    setRoleModal({ show: true, user });
  };

  // Handle Role Change (This would require backend support to convert cleaner<->employer)
  const handleSaveRoleChange = async (newRole) => {
    toast.info('Role change feature requires backend endpoint to convert user types');
    setRoleModal({ show: false, user: null });
  };

  // Handle Toggle Status
  const handleToggleStatus = async (user) => {
    try {
      const updateFunction = user.type === 'cleaner' 
        ? AdminService.updateCleaner 
        : AdminService.updateEmployer;
      
      // Use cleaner_id or employer_id for the API call
      const recordId = user.type === 'cleaner' ? user.cleaner_id : user.employer_id;
      
      await updateFunction(recordId, { is_active: !user.is_active });
      
      toast.success(`User ${!user.is_active ? 'activated' : 'deactivated'} successfully`);
      fetchAllUsers();
    } catch (error) {
      console.error('Failed to toggle status:', error);
      toast.error('Failed to update user status');
    }
  };

  // Handle Delete User
  const handleDeleteUser = (user) => {
    setDeleteModal({ show: true, user });
  };

  const confirmDelete = async () => {
    if (!deleteModal.user) return;

    setSubmitting(true);
    try {
      const deleteFunction = deleteModal.user.type === 'cleaner' 
        ? AdminService.deleteCleaner 
        : AdminService.deleteEmployer;
      
      // Use cleaner_id or employer_id for the API call
      const recordId = deleteModal.user.type === 'cleaner' 
        ? deleteModal.user.cleaner_id 
        : deleteModal.user.employer_id;
      
      await deleteFunction(recordId);
      
      toast.success(`${deleteModal.user.type} deleted successfully`);
      setDeleteModal({ show: false, user: null });
      fetchAllUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone_number?.includes(searchTerm) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company_name?.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'cleaners') return matchesSearch && user.type === 'cleaner';
    if (activeTab === 'employers') return matchesSearch && user.type === 'employer';
    if (activeTab === 'active') return matchesSearch && user.is_active;
    if (activeTab === 'inactive') return matchesSearch && !user.is_active;
    return matchesSearch;
  });

  const stats = {
    total: users.length,
    cleaners: users.filter(u => u.type === 'cleaner').length,
    employers: users.filter(u => u.type === 'employer').length,
    active: users.filter(u => u.is_active).length,
    inactive: users.filter(u => !u.is_active).length
  };

  return (
    <div className="user-management">
      <div className="page-header">
        <div>
          <h2>User Management</h2>
          <p>Manage all platform users - cleaners and employers</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setRolesManagementModal(true)}
        >
          <span className="la la-user-shield"></span>
          Manage Roles
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <span className="la la-users"></span>
          </div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <span className="la la-user-tie"></span>
          </div>
          <div className="stat-info">
            <h3>{stats.cleaners}</h3>
            <p>Cleaners</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <span className="la la-briefcase"></span>
          </div>
          <div className="stat-info">
            <h3>{stats.employers}</h3>
            <p>Employers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <span className="la la-check-circle"></span>
          </div>
          <div className="stat-info">
            <h3>{stats.active}</h3>
            <p>Active Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            <span className="la la-times-circle"></span>
          </div>
          <div className="stat-info">
            <h3>{stats.inactive}</h3>
            <p>Inactive Users</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="content-card">
        <div className="filters-section">
          <div className="tabs">
            <button 
              className={activeTab === 'all' ? 'active' : ''}
              onClick={() => setActiveTab('all')}
            >
              All Users ({stats.total})
            </button>
            <button 
              className={activeTab === 'cleaners' ? 'active' : ''}
              onClick={() => setActiveTab('cleaners')}
            >
              Cleaners ({stats.cleaners})
            </button>
            <button 
              className={activeTab === 'employers' ? 'active' : ''}
              onClick={() => setActiveTab('employers')}
            >
              Employers ({stats.employers})
            </button>
            <button 
              className={activeTab === 'active' ? 'active' : ''}
              onClick={() => setActiveTab('active')}
            >
              Active ({stats.active})
            </button>
            <button 
              className={activeTab === 'inactive' ? 'active' : ''}
              onClick={() => setActiveTab('inactive')}
            >
              Inactive ({stats.inactive})
            </button>
          </div>

          <div className="search-box">
            <span className="la la-search"></span>
            <input
              type="text"
              placeholder="Search users by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="table-responsive">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <span className="la la-user-slash"></span>
              <h3>No users found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
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
                {filteredUsers.map((user) => (
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
                          onClick={() => handleViewUser(user)}
                          title="View Details"
                        >
                          <span className="la la-eye"></span>
                        </button>
                        <button
                          className="btn-action edit"
                          onClick={() => handleEditUser(user)}
                          title="Edit User"
                        >
                          <span className="la la-edit"></span>
                        </button>
                        <button
                          className="btn-action role"
                          onClick={() => handleChangeRole(user)}
                          title="Change Role"
                        >
                          <span className="la la-user-tag"></span>
                        </button>
                        <button
                          className={`btn-action ${user.is_active ? 'deactivate' : 'activate'}`}
                          onClick={() => handleToggleStatus(user)}
                          title={user.is_active ? 'Deactivate' : 'Activate'}
                        >
                          <span className={`la ${user.is_active ? 'la-ban' : 'la-check-circle'}`}></span>
                        </button>
                        <button
                          className="btn-action delete"
                          onClick={() => handleDeleteUser(user)}
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
          )}
        </div>
      </div>

      {/* View User Modal */}
      {viewModal.show && (
        <div className="modal-overlay" onClick={() => setViewModal({ show: false, user: null })}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Details</h3>
              <button className="close-btn" onClick={() => setViewModal({ show: false, user: null })}>
                <span className="la la-times"></span>
              </button>
            </div>
            <div className="modal-body">
              {viewModal.user && (
                <div className="user-details">
                  <div className="detail-section">
                    <h4>Basic Information</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>{viewModal.user.type === 'employer' ? 'Business Name:' : 'Name:'}</label>
                        <span>
                          {viewModal.user.type === 'employer' 
                            ? (viewModal.user.business_name || viewModal.user.company_name || viewModal.user.name || 'N/A')
                            : (viewModal.user.name || 'N/A')
                          }
                        </span>
                      </div>
                      <div className="detail-item">
                        <label>Email:</label>
                        <span>{viewModal.user.email}</span>
                      </div>
                      <div className="detail-item">
                        <label>Phone:</label>
                        <span>{viewModal.user.phone_number || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <label>Address:</label>
                        <span>{viewModal.user.address || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <label>User Type:</label>
                        <span className={`type-badge ${viewModal.user.type}`}>
                          {viewModal.user.type}
                        </span>
                      </div>
                      <div className="detail-item">
                        <label>Status:</label>
                        <span className={`status-badge ${viewModal.user.is_active ? 'active' : 'inactive'}`}>
                          {viewModal.user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <label>Date Joined:</label>
                        <span>{viewModal.user.date_joined ? new Date(viewModal.user.date_joined).toLocaleString() : 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <label>Last Login:</label>
                        <span>{viewModal.user.last_login ? new Date(viewModal.user.last_login).toLocaleString() : 'Never'}</span>
                      </div>
                    </div>
                  </div>

                  {viewModal.user.type === 'cleaner' && (
                    <div className="detail-section">
                      <h4>Cleaner Information</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <label>Clean Level:</label>
                          <span>{viewModal.user.clean_level || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Experience:</label>
                          <span>{viewModal.user.experience_years || 0} years</span>
                        </div>
                        <div className="detail-item">
                          <label>Hourly Rate:</label>
                          <span>${viewModal.user.hourly_rate || 0}/hr</span>
                        </div>
                        <div className="detail-item">
                          <label>Availability:</label>
                          <span>{viewModal.user.availability || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Rating:</label>
                          <span>⭐ {viewModal.user.rating || 0}</span>
                        </div>
                        <div className="detail-item">
                          <label>Jobs Completed:</label>
                          <span>{viewModal.user.jobs_completed || 0}</span>
                        </div>
                        <div className="detail-item full-width">
                          <label>Bio:</label>
                          <span>{viewModal.user.bio || 'No bio provided'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {viewModal.user.type === 'employer' && (
                    <div className="detail-section">
                      <h4>Employer Information</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <label>Business Type:</label>
                          <span>{viewModal.user.business_type || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Verified:</label>
                          <span className={`status-badge ${viewModal.user.verified ? 'active' : 'inactive'}`}>
                            {viewModal.user.verified ? 'Verified' : 'Not Verified'}
                          </span>
                        </div>
                        <div className="detail-item">
                          <label>Jobs Posted:</label>
                          <span>{viewModal.user.jobs_posted || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editModal.show && (
        <div className="modal-overlay" onClick={() => setEditModal({ show: false, user: null })}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit User</h3>
              <button className="close-btn" onClick={() => setEditModal({ show: false, user: null })}>
                <span className="la la-times"></span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
                <div className="form-section">
                  <h4>Basic Information</h4>
                  <div className="form-grid">
                    {editModal.user?.type === 'cleaner' ? (
                      <div className="form-group full-width">
                        <label>Name *</label>
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          required
                        />
                      </div>
                    ) : (
                      <div className="form-group full-width">
                        <label>Business Name *</label>
                        <input
                          type="text"
                          value={editForm.business_name || ''}
                          onChange={(e) => setEditForm({ ...editForm, business_name: e.target.value })}
                          required
                        />
                      </div>
                    )}
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={editForm.email || ''}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={editForm.phone_number || ''}
                        onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Address</label>
                      <input
                        type="text"
                        value={editForm.address || ''}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={editForm.is_active || false}
                          onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                        />
                        <span>Active Account</span>
                      </label>
                    </div>
                  </div>
                </div>

                {editModal.user?.type === 'cleaner' && (
                  <div className="form-section">
                    <h4>Cleaner Information</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Clean Level</label>
                        <select
                          value={editForm.clean_level || 'basic'}
                          onChange={(e) => setEditForm({ ...editForm, clean_level: e.target.value })}
                        >
                          <option value="basic">Basic</option>
                          <option value="standard">Standard</option>
                          <option value="deep">Deep</option>
                          <option value="premium">Premium</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Experience (Years)</label>
                        <input
                          type="number"
                          min="0"
                          value={editForm.experience_years || ''}
                          onChange={(e) => setEditForm({ ...editForm, experience_years: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Hourly Rate ($)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editForm.hourly_rate || ''}
                          onChange={(e) => setEditForm({ ...editForm, hourly_rate: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Availability</label>
                        <select
                          value={editForm.availability || 'full_time'}
                          onChange={(e) => setEditForm({ ...editForm, availability: e.target.value })}
                        >
                          <option value="full_time">Full Time</option>
                          <option value="part_time">Part Time</option>
                          <option value="weekends">Weekends Only</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      </div>
                      <div className="form-group full-width">
                        <label>Bio</label>
                        <textarea
                          rows="4"
                          value={editForm.bio || ''}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          placeholder="Brief description about the cleaner..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {editModal.user?.type === 'employer' && (
                  <div className="form-section">
                    <h4>Employer Information</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Business Type</label>
                        <select
                          value={editForm.business_type || 'residential'}
                          onChange={(e) => setEditForm({ ...editForm, business_type: e.target.value })}
                        >
                          <option value="residential">Residential</option>
                          <option value="commercial">Commercial</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={editForm.verified || false}
                            onChange={(e) => setEditForm({ ...editForm, verified: e.target.checked })}
                          />
                          <span>Verified Business</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setEditModal({ show: false, user: null })}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Change Role Modal */}
      {roleModal.show && (
        <div className="modal-overlay" onClick={() => setRoleModal({ show: false, user: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change User Role</h3>
              <button className="close-btn" onClick={() => setRoleModal({ show: false, user: null })}>
                <span className="la la-times"></span>
              </button>
            </div>
            <div className="modal-body">
              <div className="role-change-info">
                <p><strong>Current User:</strong> {roleModal.user?.email}</p>
                <p><strong>Current Role:</strong> <span className={`type-badge ${roleModal.user?.type}`}>{roleModal.user?.role}</span></p>
              </div>
              
              <div className="role-options">
                <h4>Select New Role:</h4>
                <div className="role-cards">
                  <div 
                    className={`role-card ${roleModal.user?.type === 'cleaner' ? 'selected' : ''}`}
                    onClick={() => handleSaveRoleChange('cleaner')}
                  >
                    <span className="la la-user-tie"></span>
                    <h5>Cleaner</h5>
                    <p>Service provider role</p>
                  </div>
                  <div 
                    className={`role-card ${roleModal.user?.type === 'employer' ? 'selected' : ''}`}
                    onClick={() => handleSaveRoleChange('employer')}
                  >
                    <span className="la la-briefcase"></span>
                    <h5>Employer</h5>
                    <p>Job poster role</p>
                  </div>
                  <div 
                    className="role-card"
                    onClick={() => handleSaveRoleChange('admin')}
                  >
                    <span className="la la-user-shield"></span>
                    <h5>Admin</h5>
                    <p>Platform administrator</p>
                  </div>
                </div>
              </div>

              <div className="warning-box">
                <span className="la la-exclamation-triangle"></span>
                <p><strong>Note:</strong> Role changes require backend support. This feature converts user types between Cleaner, Employer, and Admin roles. Implementation pending backend endpoint.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="modal-overlay" onClick={() => setDeleteModal({ show: false, user: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete User</h3>
              <button className="close-btn" onClick={() => setDeleteModal({ show: false, user: null })}>
                <span className="la la-times"></span>
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <span className="la la-exclamation-circle"></span>
                <h4>Are you sure?</h4>
                <p>
                  This will permanently delete <strong>{deleteModal.user?.email}</strong> from the system.
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setDeleteModal({ show: false, user: null })}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={confirmDelete}
                disabled={submitting}
              >
                {submitting ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Roles Management Modal */}
      {rolesManagementModal && (
        <div className="modal-overlay" onClick={() => setRolesManagementModal(false)}>
          <div className="modal-content xlarge" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Roles & Permissions Management</h3>
              <button className="close-btn" onClick={() => setRolesManagementModal(false)}>
                <span className="la la-times"></span>
              </button>
            </div>
            <div className="modal-body">
              <div className="roles-management">
                <div className="roles-header">
                  <p>Manage user roles and their permissions across the platform</p>
                  <button className="btn-primary small">
                    <span className="la la-plus"></span>
                    Create New Role
                  </button>
                </div>

                <div className="roles-grid">
                  {/* Admin Role */}
                  <div className="role-card-detailed">
                    <div className="role-header">
                      <div className="role-icon admin">
                        <span className="la la-user-shield"></span>
                      </div>
                      <div>
                        <h4>Administrator</h4>
                        <p>Full system access</p>
                      </div>
                      <div className="role-badge">
                        <span className="user-count">3 users</span>
                      </div>
                    </div>
                    <div className="permissions-list">
                      <h5>Permissions:</h5>
                      <ul>
                        <li><span className="la la-check"></span> Manage all users</li>
                        <li><span className="la la-check"></span> Manage jobs & bookings</li>
                        <li><span className="la la-check"></span> Moderate chats</li>
                        <li><span className="la la-check"></span> View analytics</li>
                        <li><span className="la la-check"></span> System settings</li>
                      </ul>
                    </div>
                    <div className="role-actions">
                      <button className="btn-text">
                        <span className="la la-edit"></span> Edit
                      </button>
                      <button className="btn-text danger" disabled>
                        <span className="la la-trash"></span> Delete
                      </button>
                    </div>
                  </div>

                  {/* Employer Role */}
                  <div className="role-card-detailed">
                    <div className="role-header">
                      <div className="role-icon employer">
                        <span className="la la-briefcase"></span>
                      </div>
                      <div>
                        <h4>Employer</h4>
                        <p>Post jobs & hire cleaners</p>
                      </div>
                      <div className="role-badge">
                        <span className="user-count">{stats.employers} users</span>
                      </div>
                    </div>
                    <div className="permissions-list">
                      <h5>Permissions:</h5>
                      <ul>
                        <li><span className="la la-check"></span> Create & manage jobs</li>
                        <li><span className="la la-check"></span> View cleaner profiles</li>
                        <li><span className="la la-check"></span> Review applications</li>
                        <li><span className="la la-check"></span> Chat with cleaners</li>
                        <li><span className="la la-check"></span> Manage bookings</li>
                      </ul>
                    </div>
                    <div className="role-actions">
                      <button className="btn-text">
                        <span className="la la-edit"></span> Edit
                      </button>
                      <button className="btn-text danger" disabled>
                        <span className="la la-trash"></span> Delete
                      </button>
                    </div>
                  </div>

                  {/* Cleaner Role */}
                  <div className="role-card-detailed">
                    <div className="role-header">
                      <div className="role-icon cleaner">
                        <span className="la la-user-tie"></span>
                      </div>
                      <div>
                        <h4>Cleaner</h4>
                        <p>Provide cleaning services</p>
                      </div>
                      <div className="role-badge">
                        <span className="user-count">{stats.cleaners} users</span>
                      </div>
                    </div>
                    <div className="permissions-list">
                      <h5>Permissions:</h5>
                      <ul>
                        <li><span className="la la-check"></span> Browse jobs</li>
                        <li><span className="la la-check"></span> Apply to jobs</li>
                        <li><span className="la la-check"></span> Manage profile</li>
                        <li><span className="la la-check"></span> Chat with employers</li>
                        <li><span className="la la-check"></span> Track bookings</li>
                      </ul>
                    </div>
                    <div className="role-actions">
                      <button className="btn-text">
                        <span className="la la-edit"></span> Edit
                      </button>
                      <button className="btn-text danger" disabled>
                        <span className="la la-trash"></span> Delete
                      </button>
                    </div>
                  </div>

                  {/* Custom Role Example */}
                  <div className="role-card-detailed new">
                    <div className="role-header">
                      <div className="role-icon custom">
                        <span className="la la-plus"></span>
                      </div>
                      <div>
                        <h4>Create Custom Role</h4>
                        <p>Define your own permissions</p>
                      </div>
                    </div>
                    <div className="permissions-list">
                      <p className="text-muted">Create custom roles with specific permissions tailored to your platform needs.</p>
                    </div>
                    <div className="role-actions">
                      <button className="btn-primary full-width">
                        <span className="la la-plus"></span> Create Role
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .user-management {
          padding: 30px;
        }

        .page-header {
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
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

        .btn-primary {
          display: inline-flex;
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
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-primary.small {
          padding: 8px 16px;
          font-size: 13px;
        }

        .btn-primary.full-width {
          width: 100%;
          justify-content: center;
        }

        .btn-secondary {
          padding: 10px 20px;
          background: #f3f4f6;
          color: #4b5563;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .btn-danger {
          padding: 10px 20px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .btn-text {
          padding: 8px 12px;
          background: transparent;
          color: #6b7280;
          border: none;
          font-size: 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }

        .btn-text:hover {
          color: #8b5cf6;
        }

        .btn-text.danger:hover {
          color: #ef4444;
        }

        .btn-text:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          font-size: 28px;
          color: white;
          flex-shrink: 0;
        }

        .stat-info h3 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px;
        }

        .stat-info p {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .content-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .filters-section {
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .tabs button {
          padding: 10px 20px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tabs button:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
        }

        .tabs button.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
          color: white;
        }

        .search-box {
          position: relative;
          max-width: 400px;
        }

        .search-box span {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 18px;
          color: #9ca3af;
        }

        .search-box input {
          width: 100%;
          padding: 12px 16px 12px 45px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
        }

        .search-box input:focus {
          outline: none;
          border-color: #8b5cf6;
        }

        .loading-state,
        .empty-state {
          padding: 60px 20px;
          text-align: center;
        }

        .loading-state .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-state span {
          font-size: 64px;
          color: #d1d5db;
          display: block;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 18px;
          font-weight: 600;
          color: #4b5563;
          margin: 0 0 8px;
        }

        .empty-state p {
          font-size: 14px;
          color: #9ca3af;
          margin: 0;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table thead {
          background: #f9fafb;
        }

        .users-table th {
          padding: 16px 20px;
          text-align: left;
          font-size: 13px;
          font-weight: 700;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .users-table td {
          padding: 20px;
          border-top: 1px solid #f3f4f6;
        }

        .users-table tbody tr:hover {
          background: #f9fafb;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: grid;
          place-items: center;
          color: white;
          font-size: 20px;
          flex-shrink: 0;
        }

        .user-name {
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .user-email {
          font-size: 13px;
          color: #6b7280;
        }

        .type-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .type-badge.cleaner {
          background: #dbeafe;
          color: #1e40af;
        }

        .type-badge.employer {
          background: #fef3c7;
          color: #92400e;
        }

        .contact-info {
          font-size: 14px;
          color: #4b5563;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
        }

        .status-badge.active {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.inactive {
          background: #fee2e2;
          color: #991b1b;
        }

        .profile-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
        }

        .profile-badge.completed {
          background: #d1fae5;
          color: #065f46;
        }

        .profile-badge.incomplete {
          background: #fef3c7;
          color: #92400e;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .btn-action {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          display: grid;
          place-items: center;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-action.view {
          background: #dbeafe;
          color: #1e40af;
        }

        .btn-action.view:hover {
          background: #bfdbfe;
        }

        .btn-action.edit {
          background: #fef3c7;
          color: #92400e;
        }

        .btn-action.edit:hover {
          background: #fde68a;
        }

        .btn-action.role {
          background: #e0e7ff;
          color: #4338ca;
        }

        .btn-action.role:hover {
          background: #c7d2fe;
        }

        .btn-action.activate {
          background: #d1fae5;
          color: #065f46;
        }

        .btn-action.activate:hover {
          background: #a7f3d0;
        }

        .btn-action.deactivate {
          background: #fed7aa;
          color: #92400e;
        }

        .btn-action.deactivate:hover {
          background: #fdba74;
        }

        .btn-action.delete {
          background: #fee2e2;
          color: #991b1b;
        }

        .btn-action.delete:hover {
          background: #fecaca;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: grid;
          place-items: center;
          z-index: 1000;
          padding: 20px;
          overflow-y: auto;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal-content.large {
          max-width: 700px;
        }

        .modal-content.xlarge {
          max-width: 1200px;
        }

        .modal-header {
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .close-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          background: #f3f4f6;
          color: #6b7280;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s;
          display: grid;
          place-items: center;
        }

        .close-btn:hover {
          background: #e5e7eb;
          color: #1f2937;
        }

        .modal-body {
          padding: 24px;
        }

        .modal-footer {
          padding: 20px 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        /* User Details */
        .user-details {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .detail-section h4 {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #e5e7eb;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .detail-item.full-width {
          grid-column: 1 / -1;
        }

        .detail-item label {
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-item span {
          font-size: 15px;
          color: #1f2937;
        }

        /* Form Styles */
        .form-section {
          margin-bottom: 24px;
        }

        .form-section h4 {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #e5e7eb;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          color: #1f2937;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #8b5cf6;
        }

        .form-group textarea {
          resize: vertical;
          font-family: inherit;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          margin-top: 8px;
        }

        .checkbox-label input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .checkbox-label span {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        /* Role Change Modal */
        .role-change-info {
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .role-change-info p {
          margin: 8px 0;
          font-size: 14px;
          color: #4b5563;
        }

        .role-options h4 {
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 16px;
        }

        .role-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .role-card {
          padding: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .role-card:hover {
          border-color: #8b5cf6;
          background: #f5f3ff;
        }

        .role-card.selected {
          border-color: #8b5cf6;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        }

        .role-card span.la {
          font-size: 36px;
          color: #8b5cf6;
          display: block;
          margin-bottom: 12px;
        }

        .role-card h5 {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 6px;
        }

        .role-card p {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
        }

        .warning-box {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 16px;
          border-radius: 8px;
          display: flex;
          gap: 12px;
        }

        .warning-box span.la {
          font-size: 24px;
          color: #f59e0b;
          flex-shrink: 0;
        }

        .warning-box p {
          margin: 0;
          font-size: 13px;
          color: #78350f;
          line-height: 1.6;
        }

        /* Delete Warning */
        .delete-warning {
          text-align: center;
          padding: 20px;
        }

        .delete-warning span.la {
          font-size: 64px;
          color: #ef4444;
          display: block;
          margin-bottom: 16px;
        }

        .delete-warning h4 {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 12px;
        }

        .delete-warning p {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          line-height: 1.6;
        }

        /* Roles Management */
        .roles-management {
          min-height: 400px;
        }

        .roles-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .roles-header p {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .roles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .role-card-detailed {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.2s;
        }

        .role-card-detailed:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #8b5cf6;
        }

        .role-card-detailed.new {
          border: 2px dashed #d1d5db;
          background: #f9fafb;
        }

        .role-card-detailed .role-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .role-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          font-size: 24px;
          color: white;
          flex-shrink: 0;
        }

        .role-icon.admin {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .role-icon.employer {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .role-icon.cleaner {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .role-icon.custom {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }

        .role-card-detailed .role-header > div:nth-child(2) {
          flex: 1;
        }

        .role-card-detailed .role-header h4 {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px;
        }

        .role-card-detailed .role-header p {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
        }

        .role-badge .user-count {
          display: inline-block;
          padding: 4px 10px;
          background: #f3f4f6;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #4b5563;
        }

        .permissions-list h5 {
          font-size: 13px;
          font-weight: 700;
          color: #6b7280;
          margin: 0 0 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .permissions-list ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .permissions-list li {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 0;
          font-size: 13px;
          color: #4b5563;
        }

        .permissions-list li span.la {
          color: #10b981;
          font-size: 14px;
        }

        .permissions-list .text-muted {
          font-size: 13px;
          color: #9ca3af;
          line-height: 1.6;
        }

        .role-actions {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 12px;
        }

        @media (max-width: 768px) {
          .user-management {
            padding: 20px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .tabs {
            overflow-x: auto;
            flex-wrap: nowrap;
          }

          .users-table {
            font-size: 13px;
          }

          .users-table th,
          .users-table td {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default UserManagement;
