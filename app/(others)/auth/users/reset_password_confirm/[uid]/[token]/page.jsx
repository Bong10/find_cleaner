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
                  <input
                    type="password"
                    name="new_password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    required
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>
                <div className="form-group">
                  <label>Confirm new password</label>
                  <input
                    type="password"
                    name="re_new_password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    disabled={loading}
                    autoComplete="new-password"
                  />
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
