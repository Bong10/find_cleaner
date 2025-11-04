import React from 'react';

const DeleteJobModal = ({ onClose, onConfirm }) => {
  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Confirm Delete</h3>
            <button className="close-btn" onClick={onClose}>
              <span className="la la-times"></span>
            </button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete this job? This action cannot be undone and will also remove all applications associated with this job.</p>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-danger" onClick={onConfirm}>
              Delete Job
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-content.small {
          max-width: 450px;
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
          width: 32px;
          height: 32px;
          border: none;
          background: #f3f4f6;
          border-radius: 6px;
          cursor: pointer;
          display: grid;
          place-items: center;
          font-size: 18px;
          color: #6b7280;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #e5e7eb;
        }

        .modal-body {
          padding: 24px;
        }

        .modal-body p {
          margin: 0;
          color: #4b5563;
          line-height: 1.6;
        }

        .modal-footer {
          padding: 20px 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn-secondary,
        .btn-danger {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .btn-danger {
          background: #dc2626;
          color: white;
        }

        .btn-danger:hover {
          background: #b91c1c;
        }
      `}</style>
    </>
  );
};

export default DeleteJobModal;
