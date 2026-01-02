'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { confirmPasswordReset } from '@/services/authService';
import Link from 'next/link';
import Header from '@/components/pages-menu/login/Header';
import MobileMenu from '@/components/header/MobileMenu';

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const uid = params?.uid;
  const token = params?.token;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      return toast.error('Please fill in both password fields');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      await confirmPasswordReset({ uid, token, new_password: newPassword, re_new_password: confirmPassword });
      toast.success('Password has been reset. You can now log in.');
      router.push('/login');
    } catch (err) {
      toast.error('Reset failed. The link may be invalid or expired.');
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
              <h3>Set a new password</h3>
              <form onSubmit={onSubmit} noValidate>
                <div className="form-group">
                  <label>New password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="new_password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      required
                      disabled={loading}
                      autoComplete="new-password"
                      style={{ paddingRight: '45px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#696969',
                        fontSize: '18px'
                      }}
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      <i className={showNewPassword ? "la la-eye-slash" : "la la-eye"}></i>
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Confirm new password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="re_new_password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      disabled={loading}
                      autoComplete="new-password"
                      style={{ paddingRight: '45px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#696969',
                        fontSize: '18px'
                      }}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      <i className={showConfirmPassword ? "la la-eye-slash" : "la la-eye"}></i>
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <button className="theme-btn btn-style-one" type="submit" disabled={loading}>
                    {loading ? 'Saving…' : 'Save new password'}
                  </button>
                </div>
              </form>
              <div className="text">
                Back to <Link href="/login">login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
