'use client';

const DeleteConfirmModal = ({ user, onClose, onConfirm, submitting }) => {
  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delete-confirm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Confirm Deletion</h3>
          <button className="close-btn" onClick={onClose}>
            <span className="la la-times"></span>
          </button>
        </div>
        <div className="modal-body">
          <div className="warning-icon">
            <span className="la la-exclamation-triangle"></span>
          </div>
          <h4>Are you sure you want to delete this user?</h4>
          <div className="user-info">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Name:</strong> {user.name || 'N/A'}</p>
            <p><strong>Type:</strong> <span className={`type-badge ${user.type}`}>{user.type}</span></p>
          </div>
          <div className="warning-box danger">
            <span className="la la-info-circle"></span>
            <p><strong>Warning:</strong> This action cannot be undone. All user data, history, and associated records will be permanently deleted.</p>
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
            className="btn-danger"
            onClick={onConfirm}
            disabled={submitting}
          >
            {submitting ? 'Deleting...' : 'Yes, Delete User'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
