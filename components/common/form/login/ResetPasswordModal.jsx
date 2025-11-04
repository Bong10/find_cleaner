'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { requestPasswordReset } from '@/services/authService';

const ResetPasswordModal = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0); // seconds remaining
  const [lastError, setLastError] = useState('');
  const bs = useMemo(() => (typeof window !== 'undefined' ? window.bootstrap : null), []);
  const timerRef = useRef(null);

  // Initialize cooldown from localStorage if present
  useEffect(() => {
    try {
      const until = localStorage.getItem('pw_reset_cooldown_until');
      if (until) {
        const remainMs = parseInt(until, 10) - Date.now();
        if (remainMs > 0) startCooldown(Math.ceil(remainMs / 1000));
      }
    } catch {}
    // Cleanup on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCooldown = (seconds) => {
    if (!seconds || seconds <= 0) return;
    setCooldown(seconds);
    try {
      localStorage.setItem('pw_reset_cooldown_until', String(Date.now() + seconds * 1000));
    } catch {}
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          try {
            localStorage.removeItem('pw_reset_cooldown_until');
          } catch {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    setLastError('');
    try {
      await requestPasswordReset(email.trim());
      toast.success('If an account exists, a reset link has been sent.');
      // Close modal if present
      try {
        const modalEl = document.getElementById('resetPasswordModal');
        if (bs?.Modal && modalEl) {
          const inst = bs.Modal.getInstance(modalEl) || new bs.Modal(modalEl);
          inst.hide();
        }
      } catch {}
    } catch (err) {
      // Prefer backend message
      const status = err?.response?.status;
      const data = err?.response?.data || {};
      const msg = data?.detail || data?.message || err?.message || 'Request failed';
      setLastError(typeof msg === 'string' ? msg : 'Request failed');
      toast.error(String(msg));
      if (status === 429 && (data?.wait_seconds || data?.waitSeconds)) {
        const wait = Number(data.wait_seconds || data.waitSeconds);
        if (!Number.isNaN(wait) && wait > 0) startCooldown(wait);
      }
    } finally {
      setLoading(false);
    }
  };

  const backToLogin = () => {
    try {
      const resetEl = document.getElementById('resetPasswordModal');
      if (bs?.Modal && resetEl) {
        const inst = bs.Modal.getInstance(resetEl) || new bs.Modal(resetEl);
        inst.hide();
      }
      const loginEl = document.getElementById('loginPopupModal');
      if (bs?.Modal && loginEl) {
        const loginInst = bs.Modal.getInstance(loginEl) || new bs.Modal(loginEl);
        loginInst.show();
      }
    } catch {}
  };

  return (
    <div className="modal fade" id="resetPasswordModal" tabIndex={-1}>
      <div className="modal-dialog modal-lg modal-dialog-centered login-modal modal-dialog-scrollable">
        <div className="modal-content">
          <button type="button" className="closed-modal" data-bs-dismiss="modal"></button>
          <div className="modal-body p-4">
            <div className="login-form default-form">
              <div className="form-inner" style={{ display: 'grid', rowGap: 16 }}>
                <h3 className="mb-2">Forgot password</h3>
                <p className="mb-4">Enter your email and we'll send you a reset link.</p>
                <form onSubmit={onSubmit} noValidate>
                  <div className="form-group mb-3">
                    <label className="mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>
                  <div className="form-group" style={{ marginTop: 16, marginBottom: 8 }}>
                    <button 
                      className="theme-btn btn-style-one" 
                      type="submit" 
                      disabled={loading || cooldown > 0}
                      style={cooldown > 0 ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                    >
                      {loading 
                        ? 'Sending…' 
                        : cooldown > 0 
                          ? `Send reset link in ${Math.floor(cooldown / 60)}:${String(cooldown % 60).padStart(2, '0')}` 
                          : 'Send reset link'}
                    </button>
                  </div>
                  {!!lastError && (
                    <div className="text-danger" style={{ marginBottom: 8, fontSize: 14 }}>
                      {lastError}
                    </div>
                  )}
                  {cooldown > 0 && !lastError && (
                    <div className="text-danger" style={{ fontSize: 14 }}>
                      Please wait for 2 minutes before requesting another reset.
                    </div>
                  )}
                </form>
                <div className="bottom-box" style={{ marginTop: 20 }}>
                  <div className="text text-center">
                    Remembered your password?{' '}
                    <a href="#" className="login" onClick={(e) => { e.preventDefault(); backToLogin(); }}>
                      Back to login
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
