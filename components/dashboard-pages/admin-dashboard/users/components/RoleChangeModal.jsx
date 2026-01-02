'use client';

import { useState, useEffect } from 'react';
import AdminService from '@/services/adminService';
import { toast } from 'react-toastify';

const RoleChangeModal = ({ user, onClose, onSuccess }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
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

  const handleRoleChange = async (roleId) => {
    if (!user || !roleId) return;

    setSubmitting(true);
    try {
      await AdminService.changeUserRole(user.id, roleId);
      toast.success('User role changed successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to change role:', error);
      toast.error(error.response?.data?.message || 'Failed to change user role');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Change User Role</h3>
          <button className="close-btn" onClick={onClose}>
            <span className="la la-times"></span>
          </button>
        </div>
        <div className="modal-body">
          <div className="role-change-info">
            <p><strong>Current User:</strong> {user.email}</p>
            <p><strong>Current Role:</strong> <span className={`type-badge ${user.type}`}>{user.role}</span></p>
          </div>
          
          <div className="role-options">
            <h4>Select New Role:</h4>
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading roles...</p>
              </div>
            ) : (
              <div className="role-cards">
                {roles.map((role) => (
                  <div 
                    key={role.id}
                    className={`role-card ${selectedRole === role.id ? 'selected' : ''}`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <span className={`la ${
                      role.name.toLowerCase() === 'admin' ? 'la-user-shield' :
                      role.name.toLowerCase() === 'employer' ? 'la-briefcase' :
                      role.name.toLowerCase() === 'cleaner' ? 'la-user-tie' :
                      'la-user'
                    }`}></span>
                    <h5>{role.name}</h5>
                    <p>Role ID: {role.id}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="warning-box">
            <span className="la la-exclamation-triangle"></span>
            <p><strong>Warning:</strong> Changing roles will affect user permissions and access. Make sure you understand the implications before proceeding.</p>
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="btn-secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={() => handleRoleChange(selectedRole)}
            disabled={!selectedRole || submitting}
          >
            {submitting ? 'Changing...' : 'Change Role'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleChangeModal;
