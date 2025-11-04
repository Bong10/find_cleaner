'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { requestPasswordReset } from '@/services/authService';
import Link from 'next/link';
import Header from '@/components/pages-menu/login/Header';
import MobileMenu from '@/components/header/MobileMenu';

const Page = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [lastError, setLastError] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    try {
      const until = localStorage.getItem('pw_reset_cooldown_until');
      if (until) {
        const remainMs = parseInt(until, 10) - Date.now();
        if (remainMs > 0) startCooldown(Math.ceil(remainMs / 1000));
      }
    } catch {}
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
          try { localStorage.removeItem('pw_reset_cooldown_until'); } catch {}
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
    } catch (err) {
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

  return (
    <>
      <Header />
      <MobileMenu />
      <div className="login-section">
        <div className="image-layer" style={{ backgroundImage: 'url(/images/background/12.jpg)' }} />
        <div className="outer-box">
          <div className="login-form default-form">
            <div className="form-inner">
              <h3>Forgot password</h3>
              <p className="mb-3">Enter the email associated with your account and we'll send a reset link.</p>
              <form onSubmit={onSubmit} noValidate>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
                <div className="form-group" style={{ marginTop: 12 }}>
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
                  <div className="text-danger" style={{ marginTop: 8, fontSize: 14 }}>
                    {lastError}
                  </div>
                )}
                {cooldown > 0 && !lastError && (
                  <div className="text-danger" style={{ fontSize: 14, marginTop: 8 }}>
                    Please wait for {Math.ceil(cooldown / 60)} {Math.ceil(cooldown / 60) === 1 ? 'minute' : 'minutes'} before requesting another reset.
                  </div>
                )}
              </form>
              <div className="text">
                Remembered your password? <Link href="/login">Back to login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
