'use client';

import { useState } from 'react';

const UserEditModal = ({ user, onClose, onSave, submitting }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    address: user?.address || '',
    is_active: user?.is_active || false,
    // Cleaner specific
    ...(user?.type === 'cleaner' && {
      hourly_rate: user?.hourly_rate || '',
      experience_years: user?.experience_years || '',
      bio: user?.bio || '',
      clean_level: user?.clean_level || 'basic',
      availability: user?.availability || 'full_time'
    }),
    // Employer specific
    ...(user?.type === 'employer' && {
      business_name: user?.business_name || user?.company_name || '',
      business_type: user?.business_type || 'residential',
      verified: user?.verified || false
    })
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit User</h3>
          <button className="close-btn" onClick={onClose}>
            <span className="la la-times"></span>
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h4>Basic Information</h4>
              <div className="form-grid">
                {user.type === 'cleaner' ? (
                  <div className="form-group full-width">
                    <label>Name *</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                ) : (
                  <div className="form-group full-width">
                    <label>Business Name *</label>
                    <input
                      type="text"
                      value={formData.business_name || ''}
                      onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                      required
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone_number || ''}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Address</label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.is_active || false}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <span>Active Account</span>
                  </label>
                </div>
              </div>
            </div>

            {user.type === 'cleaner' && (
              <div className="form-section">
                <h4>Cleaner Information</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Clean Level</label>
                    <select
                      value={formData.clean_level || 'basic'}
                      onChange={(e) => setFormData({ ...formData, clean_level: e.target.value })}
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
                      value={formData.experience_years || ''}
                      onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Hourly Rate ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.hourly_rate || ''}
                      onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Availability</label>
                    <select
                      value={formData.availability || 'full_time'}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
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
                      value={formData.bio || ''}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Brief description about the cleaner..."
                    />
                  </div>
                </div>
              </div>
            )}

            {user.type === 'employer' && (
              <div className="form-section">
                <h4>Employer Information</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Business Type</label>
                    <select
                      value={formData.business_type || 'residential'}
                      onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                    >
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.verified || false}
                        onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
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
                onClick={onClose}
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
  );
};

export default UserEditModal;
