'use client';

import { useState } from 'react';
import AdminService from '@/services/adminService';
import { toast } from 'react-toastify';

const ResolveFlagModal = ({ flag, onClose, onResolved }) => {
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolving, setResolving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleResolve = async () => {
    if (!resolutionNotes.trim()) {
      toast.error('Please provide resolution notes');
      return;
    }

    if (resolutionNotes.trim().length < 10) {
      toast.error('Resolution notes must be at least 10 characters');
      return;
    }

    setResolving(true);
    try {
      await AdminService.updateFlaggedChat(flag.id, {
        resolved: true,
        resolution_notes: resolutionNotes.trim()
      });
      toast.success('Flag resolved successfully');
      onResolved?.();
      onClose();
    } catch (error) {
      console.error('Error resolving flag:', error);
      toast.error('Failed to resolve flag');
    } finally {
      setResolving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="header-content">
              <h2>
                <span className="la la-flag"></span>
                Resolve Flagged Chat
              </h2>
              <p className="flag-id">Flag #{flag.id}</p>
            </div>
            <button className="close-btn" onClick={onClose}>
              <span className="la la-times"></span>
            </button>
          </div>

          <div className="modal-body">
            <div className="flag-info-section">
              <h3>
                <span className="la la-info-circle"></span>
                Flag Details
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Chat ID</span>
                  <span className="info-value">
                    <span className="la la-comments"></span>
                    #{flag.chat || 'N/A'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Flagged By</span>
                  <span className="info-value">
                    <span className="la la-user"></span>
                    {flag.flagged_by_name || `User #${flag.flagged_by}` || 'Unknown'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Flagged Date</span>
                  <span className="info-value">
                    <span className="la la-calendar"></span>
                    {formatDate(flag.flagged_at || flag.created_at)}
                  </span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Reason for Flagging</span>
                  <div className="reason-box">
                    <span className="la la-exclamation-triangle"></span>
                    <p>{flag.reason || 'No reason provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {!showConfirm ? (
              <div className="resolution-section">
                <h3>
                  <span className="la la-edit"></span>
                  Resolution Notes
                </h3>
                <p className="section-description">
                  Please provide detailed notes about how this flag was handled and what actions were taken.
                  This will be recorded for audit purposes.
                </p>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="e.g., Reviewed chat content. Found inappropriate language. Issued warning to user. Chat archived for review..."
                  rows={6}
                  disabled={resolving}
                />
                <div className="char-count">
                  {resolutionNotes.length} characters
                  {resolutionNotes.length < 10 && (
                    <span className="char-warning"> (minimum 10 required)</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="confirmation-section">
                <div className="confirmation-icon">
                  <span className="la la-question-circle"></span>
                </div>
                <h3>Confirm Resolution</h3>
                <p>
                  Are you sure you want to mark this flag as resolved? This action will update the flag status
                  and cannot be undone.
                </p>
                <div className="confirmation-preview">
                  <strong>Your resolution notes:</strong>
                  <p>{resolutionNotes}</p>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            {!showConfirm ? (
              <>
                <button
                  className="btn-cancel"
                  onClick={onClose}
                  disabled={resolving}
                >
                  Cancel
                </button>
                <button
                  className="btn-resolve"
                  onClick={() => setShowConfirm(true)}
                  disabled={resolving || resolutionNotes.trim().length < 10}
                >
                  <span className="la la-check"></span>
                  Resolve Flag
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn-back"
                  onClick={() => setShowConfirm(false)}
                  disabled={resolving}
                >
                  <span className="la la-arrow-left"></span>
                  Back
                </button>
                <button
                  className="btn-confirm"
                  onClick={handleResolve}
                  disabled={resolving}
                >
                  {resolving ? (
                    <>
                      <div className="btn-spinner"></div>
                      Resolving...
                    </>
                  ) : (
                    <>
                      <span className="la la-check-circle"></span>
                      Confirm & Resolve
                    </>
                  )}
                </button>
              </>
            )}
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
          z-index: 9999;
          padding: 20px;
        }

        .modal-container {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 24px 28px;
          border-bottom: 1px solid #e5e7eb;
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          color: white;
          border-radius: 12px 12px 0 0;
        }

        .header-content {
          flex: 1;
        }

        .modal-header h2 {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 6px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .modal-header h2 .la {
          font-size: 28px;
        }

        .flag-id {
          margin: 0;
          font-size: 14px;
          opacity: 0.9;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .modal-body {
          overflow-y: auto;
          padding: 28px;
          flex: 1;
        }

        .flag-info-section {
          background: #fef2f2;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          border: 2px solid #fecaca;
        }

        .flag-info-section h3 {
          font-size: 18px;
          font-weight: 600;
          color: #991b1b;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .flag-info-section h3 .la {
          color: #dc2626;
          font-size: 20px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .info-item.full-width {
          grid-column: 1 / -1;
        }

        .info-label {
          font-size: 13px;
          color: #991b1b;
          font-weight: 600;
        }

        .info-value {
          font-size: 15px;
          color: #1f2937;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .info-value .la {
          color: #dc2626;
          font-size: 16px;
        }

        .reason-box {
          background: white;
          padding: 14px;
          border-radius: 8px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          border: 2px solid #fca5a5;
        }

        .reason-box .la {
          color: #dc2626;
          font-size: 20px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .reason-box p {
          margin: 0;
          color: #991b1b;
          font-size: 14px;
          line-height: 1.6;
          font-weight: 500;
        }

        .resolution-section h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 12px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .resolution-section h3 .la {
          color: #8b5cf6;
          font-size: 20px;
        }

        .section-description {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0 0 16px 0;
        }

        textarea {
          width: 100%;
          padding: 14px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          line-height: 1.6;
          resize: vertical;
          transition: border-color 0.2s;
        }

        textarea:focus {
          outline: none;
          border-color: #8b5cf6;
        }

        textarea:disabled {
          background: #f9fafb;
          cursor: not-allowed;
        }

        .char-count {
          text-align: right;
          font-size: 13px;
          color: #9ca3af;
          margin-top: 8px;
        }

        .char-warning {
          color: #dc2626;
          font-weight: 600;
        }

        .confirmation-section {
          text-align: center;
          padding: 20px;
        }

        .confirmation-icon {
          margin-bottom: 16px;
        }

        .confirmation-icon .la {
          font-size: 60px;
          color: #fbbf24;
        }

        .confirmation-section h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 12px 0;
        }

        .confirmation-section > p {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0 0 20px 0;
        }

        .confirmation-preview {
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          text-align: left;
          border: 2px solid #e5e7eb;
        }

        .confirmation-preview strong {
          display: block;
          font-size: 14px;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .confirmation-preview p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
        }

        .modal-footer {
          padding: 20px 28px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn-cancel,
        .btn-resolve,
        .btn-back,
        .btn-confirm {
          height: 44px;
          padding: 0 24px;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .btn-cancel,
        .btn-back {
          background: white;
          color: #6b7280;
          border: 1px solid #d1d5db;
        }

        .btn-cancel:hover:not(:disabled),
        .btn-back:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .btn-resolve {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .btn-resolve:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .btn-confirm {
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          color: white;
        }

        .btn-confirm:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
        }

        .btn-resolve:disabled,
        .btn-confirm:disabled,
        .btn-cancel:disabled,
        .btn-back:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .modal-container {
            max-height: 95vh;
          }

          .modal-header,
          .modal-body,
          .modal-footer {
            padding: 20px;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .modal-footer {
            flex-direction: column-reverse;
          }

          .btn-cancel,
          .btn-resolve,
          .btn-back,
          .btn-confirm {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default ResolveFlagModal;
