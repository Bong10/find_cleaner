"use client";

import { useEffect, useState } from "react";

// Hook for using the confirm modal
export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "Confirm Action",
    message: "Are you sure?",
    confirmText: "Confirm",
    cancelText: "Cancel",
    confirmStyle: "danger",
    icon: "la-exclamation-triangle",
    onConfirm: () => {},
  });

  const confirm = (options) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title: options.title || "Confirm Action",
        message: options.message || "Are you sure?",
        confirmText: options.confirmText || "Confirm",
        cancelText: options.cancelText || "Cancel",
        confirmStyle: options.confirmStyle || "danger",
        icon: options.icon || "la-exclamation-triangle",
        onConfirm: () => {
          resolve(true);
          setConfirmState(prev => ({ ...prev, isOpen: false }));
        },
      });
    });
  };

  const closeConfirm = () => {
    setConfirmState(prev => ({ ...prev, isOpen: false }));
  };

  return {
    confirmState,
    confirm,
    closeConfirm,
  };
};

// Modal Component
const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmStyle = "danger", // danger, warning, success, primary
  icon = "la-exclamation-triangle"
}) => {
  
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getConfirmButtonStyle = () => {
    switch (confirmStyle) {
      case 'danger':
        return { background: '#dc3545', borderColor: '#dc3545' };
      case 'warning':
        return { background: '#ffc107', borderColor: '#ffc107', color: '#000' };
      case 'success':
        return { background: '#28a745', borderColor: '#28a745' };
      case 'primary':
      default:
        return { background: '#1967d2', borderColor: '#1967d2' };
    }
  };

  const getIconStyle = () => {
    switch (confirmStyle) {
      case 'danger':
        return { background: '#fee', color: '#dc3545' };
      case 'warning':
        return { background: '#fff8e1', color: '#f9a825' };
      case 'success':
        return { background: '#e8f5e9', color: '#28a745' };
      case 'primary':
      default:
        return { background: '#e8f0ff', color: '#1967d2' };
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          animation: 'fadeIn 0.2s ease',
        }}
      />
      
      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        animation: 'slideIn 0.3s ease',
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          width: '420px',
          maxWidth: '90vw',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              ...getIconStyle()
            }}>
              <i className={`la ${icon}`} style={{ fontSize: '24px' }}></i>
            </div>
            <h3 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937'
            }}>
              {title}
            </h3>
            <button
              onClick={onClose}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <i className="la la-times" style={{ fontSize: '20px', color: '#6b7280' }}></i>
            </button>
          </div>
          
          {/* Body */}
          <div style={{
            padding: '20px 24px',
            color: '#4b5563',
            fontSize: '15px',
            lineHeight: '1.6'
          }}>
            {message}
          </div>
          
          {/* Footer */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={onClose}
              className="theme-btn btn-style-three"
              style={{
                padding: '8px 20px',
                fontSize: '14px',
                cursor: 'pointer',
                borderRadius: '6px',
                transition: 'all 0.2s'
              }}
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="theme-btn"
              style={{
                padding: '8px 20px',
                fontSize: '14px',
                cursor: 'pointer',
                borderRadius: '6px',
                color: 'white',
                border: '1px solid',
                transition: 'all 0.2s',
                ...getConfirmButtonStyle()
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -45%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </>
  );
};

export default ConfirmModal;