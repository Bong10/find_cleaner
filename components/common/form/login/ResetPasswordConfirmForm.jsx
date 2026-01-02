'use client';

import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { confirmPasswordReset } from '@/services/authService';

function strengthInfo(pw) {
  let score = 0;
  if (!pw) return { score: 0, label: 'Too weak' };
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;

  const label =
    score <= 1 ? 'Weak' : score === 2 ? 'Okay' : score === 3 ? 'Strong' : 'Very strong';
  return { score, label };
}

const ResetPasswordConfirmForm = ({ uid, token, onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = useMemo(() => strengthInfo(newPassword), [newPassword]);
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      return toast.error('Please fill in both password fields');
    }
    if (newPassword.length < 8) {
      return toast.error('Password must be at least 8 characters');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await confirmPasswordReset({ uid, token, new_password: newPassword, re_new_password: confirmPassword });
      toast.success('Password has been reset. You can now log in.');
      onSuccess?.();
    } catch (err) {
      const data = err?.response?.data;
      let msg = 'Reset failed. The link may be invalid or expired.';
      
      // Handle detail as array or string
      if (data?.detail) {
        msg = Array.isArray(data.detail) ? data.detail[0] : data.detail;
      } else if (data?.message) {
        msg = Array.isArray(data.message) ? data.message[0] : data.message;
      } else if (err?.message) {
        msg = err.message;
      }
      
      toast.error(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-inner">
      <h3 className="mb-2">Set a new password</h3>
      <form onSubmit={onSubmit} noValidate>
        <div className="form-group">
          <label className="mb-2">New password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showNew ? 'text' : 'password'}
              name="new_password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              required
              disabled={loading}
              autoComplete="new-password"
              style={{ paddingRight: 45 }}
            />
            <button
              type="button"
              onClick={() => setShowNew((s) => !s)}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 36,
                height: 36,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                color: '#6b7280',
                borderRadius: 6,
              }}
              aria-label={showNew ? 'Hide password' : 'Show password'}
            >
              <span className={`la ${showNew ? 'la-eye-slash' : 'la-eye'}`} style={{ fontSize: 18 }} />
            </button>
          </div>

          {/* Strength meter */}
          {newPassword && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  style={{
                    width: 56,
                    height: 6,
                    borderRadius: 999,
                    background: strength.score > i 
                      ? (i === 0 || i === 1 ? '#f59e0b' : i === 2 ? '#10b981' : '#22c55e')
                      : '#e5e7eb',
                  }}
                />
              ))}
              <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 4 }}>
                {strength.label}
              </span>
            </div>
          )}
        </div>

        <div className="form-group" style={{ marginTop: 12 }}>
          <label className="mb-2">Confirm new password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirm ? 'text' : 'password'}
              name="re_new_password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your new password"
              required
              disabled={loading}
              autoComplete="new-password"
              style={{ paddingRight: 45 }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 36,
                height: 36,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                color: '#6b7280',
                borderRadius: 6,
              }}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              <span className={`la ${showConfirm ? 'la-eye-slash' : 'la-eye'}`} style={{ fontSize: 18 }} />
            </button>
          </div>
          {!passwordsMatch && confirmPassword && (
            <div style={{ fontSize: 13, color: '#b91c1c', marginTop: 6 }}>
              Passwords do not match.
            </div>
          )}
        </div>

        <div className="form-group" style={{ marginTop: 16 }}>
          <button 
            className="theme-btn btn-style-one" 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Saving…' : 'Save new password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordConfirmForm;
