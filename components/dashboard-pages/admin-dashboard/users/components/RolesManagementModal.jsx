'use client';

import { useState, useEffect } from 'react';
import AdminService from '@/services/adminService';
import { toast } from 'react-toastify';

const RolesManagementModal = ({ onClose }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getAllRoles();
      setRoles(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      toast.error('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = () => {
    setFormData({ name: '', description: '' });
    setShowCreateModal(true);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setFormData({ 
      name: role.name || '', 
      description: role.description || '' 
    });
    setShowEditModal(true);
  };

  const handleDeleteRole = (role) => {
    setSelectedRole(role);
    setShowDeleteModal(true);
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    setSubmitting(true);
    try {
      await AdminService.createRole(formData);
      toast.success('Role created successfully');
      setShowCreateModal(false);
      fetchRoles();
    } catch (error) {
      console.error('Failed to create role:', error);
      toast.error(error.response?.data?.message || 'Failed to create role');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    setSubmitting(true);
    try {
      await AdminService.updateRole(selectedRole.id, formData);
      toast.success('Role updated successfully');
      setShowEditModal(false);
      setSelectedRole(null);
      fetchRoles();
    } catch (error) {
      console.error('Failed to update role:', error);
      toast.error(error.response?.data?.message || 'Failed to update role');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setSubmitting(true);
    try {
      await AdminService.deleteRole(selectedRole.id);
      toast.success('Role deleted successfully');
      setShowDeleteModal(false);
      setSelectedRole(null);
      fetchRoles();
    } catch (error) {
      console.error('Failed to delete role:', error);
      toast.error(error.response?.data?.message || 'Failed to delete role. It may be assigned to users.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content xlarge" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Roles Management</h3>
          <button className="close-btn" onClick={onClose}>
            <span className="la la-times"></span>
          </button>
        </div>
        
        <div className="modal-body">
          <div className="roles-header">
            <div>
              <p>Manage user roles and permissions for the platform</p>
            </div>
            <button className="btn-primary" onClick={handleCreateRole}>
              <span className="la la-plus"></span>
              Create New Role
            </button>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading roles...</p>
            </div>
          ) : roles.length === 0 ? (
            <div className="empty-state">
              <span className="la la-user-shield"></span>
              <h3>No roles found</h3>
              <p>Create your first role to get started</p>
            </div>
          ) : (
            <div className="roles-grid">
              {roles.map((role) => (
                <div key={role.id} className="role-card-detailed">
                  <div className="role-card-header">
                    <div className={`role-icon ${role.name.toLowerCase()}`}>
                      <span className={`la ${
                        role.name.toLowerCase() === 'admin' ? 'la-user-shield' :
                        role.name.toLowerCase() === 'employer' ? 'la-briefcase' :
                        role.name.toLowerCase() === 'cleaner' ? 'la-user-tie' :
                        'la-user'
                      }`}></span>
                    </div>
                    <div className="role-info">
                      <h4>{role.name}</h4>
                      <p>{role.description || 'No description provided'}</p>
                    </div>
                  </div>
                  
                  <div className="role-stats">
                    <div className="stat-item">
                      <span className="la la-users"></span>
                      <span>{role.user_count || 0} Users</span>
                    </div>
                    <div className="stat-item">
                      <span className="la la-calendar"></span>
                      <span>ID: {role.id}</span>
                    </div>
                  </div>

                  <div className="role-actions">
                    <button 
                      className="btn-action edit"
                      onClick={() => handleEditRole(role)}
                      title="Edit Role"
                    >
                      <span className="la la-edit"></span>
                      Edit
                    </button>
                    <button 
                      className="btn-action delete"
                      onClick={() => handleDeleteRole(role)}
                      title="Delete Role"
                    >
                      <span className="la la-trash"></span>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Role</h3>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                <span className="la la-times"></span>
              </button>
            </div>
            <form onSubmit={handleSubmitCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Role Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Manager, Supervisor"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this role"
                    rows="3"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditModal && selectedRole && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Role</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                <span className="la la-times"></span>
              </button>
            </div>
            <form onSubmit={handleSubmitEdit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Role Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Manager, Supervisor"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this role"
                    rows="3"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowEditModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Updating...' : 'Update Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedRole && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Deletion</h3>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                <span className="la la-times"></span>
              </button>
            </div>
            <div className="modal-body">
              <div className="warning-icon">
                <span className="la la-exclamation-triangle"></span>
              </div>
              <h4>Are you sure you want to delete this role?</h4>
              <div className="user-info-box">
                <p><strong>Role Name:</strong> {selectedRole.name}</p>
                <p><strong>Description:</strong> {selectedRole.description || 'None'}</p>
                <p><strong>Users with this role:</strong> {selectedRole.user_count || 0}</p>
              </div>
              <div className="warning-box danger">
                <span className="la la-info-circle"></span>
                <p><strong>Warning:</strong> Deleting a role may affect users currently assigned to it. Make sure to reassign users before deleting.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleConfirmDelete}
                disabled={submitting}
              >
                {submitting ? 'Deleting...' : 'Yes, Delete Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesManagementModal;
