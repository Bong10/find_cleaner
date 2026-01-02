'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Image from 'next/image';
import AuthService from '@/services/authService';
import { fetchCurrentUser } from '@/store/slices/authSlice';

const extractErrMsg = (err) => {
  if (!err) return 'Login failed';
  if (typeof err === 'string') return err;
  const data = err?.response?.data || err;
  
  // Handle backend detail field (string or array)
  if (typeof data?.detail === 'string') return data.detail;
  if (Array.isArray(data?.detail) && data.detail[0]) {
    return String(data.detail[0]);
  }
  
  // Handle non_field_errors
  if (Array.isArray(data?.non_field_errors) && data.non_field_errors[0]) {
    return String(data.non_field_errors[0]);
  }
  
  // Handle message field
  if (typeof data?.message === 'string') return data.message;
  
  // Handle field-specific errors
  for (const k of ['email', 'password']) {
    if (Array.isArray(data?.[k]) && data[k][0]) return String(data[k][0]);
  }
  
  return err?.message || 'Login failed';
};

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/admin-dashboard/overview');
    }
  }, [isAuthenticated, user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      // Use dedicated admin login endpoint - backend validates admin role
      const loginResponse = await AuthService.adminLogin(formData.email.trim(), formData.password);
      
      // Manually set isAuthenticated since we're not using loginUser thunk
      if (loginResponse?.access) {
        // Fetch user data after successful login using Redux thunk
        await dispatch(fetchCurrentUser()).unwrap();

        toast.success('Welcome to admin portal');
        router.push('/admin-dashboard/overview');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      const msg = extractErrMsg(err);
      
      // Show the backend error message directly
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          {/* Logo and Header */}
          <div className="admin-login-header">
            <div className="logo-wrapper">
              <Image
                width={54}
                height={50}
                src="/images/logo.png"
                alt="Find Cleaner Admin"
                title="Find Cleaner Admin Portal"
              />
            </div>
            <h1>Admin Portal</h1>
            <p>Restricted access for authorized personnel only</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@findcleaner.com"
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className={`la ${showPassword ? 'la-eye-slash' : 'la-eye'}`} />
                </button>
              </div>
            </div>

            <div className="form-footer">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
            </div>

            <button type="submit" className="admin-login-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <span className="la la-sign-in-alt"></span>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="security-notice">
            <span className="la la-shield-alt"></span>
            <p>This is a secure area. All access attempts are logged.</p>
          </div>
        </div>

        {/* Back to main site */}
        <div className="back-to-site">
          <Link href="/">
            <span className="la la-arrow-left"></span>
            Back to Find Cleaner
          </Link>
        </div>
      </div>

      <style jsx>{`
        .admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .admin-login-container {
          width: 100%;
          max-width: 440px;
        }

        .admin-login-card {
          background: white;
          border-radius: 16px;
          padding: 40px 32px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .admin-login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo-wrapper {
          display: inline-block;
          margin-bottom: 16px;
        }

        .admin-login-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px;
        }

        .admin-login-header p {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .admin-login-form {
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .form-group input {
          width: 100%;
          height: 48px;
          padding: 0 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 15px;
          transition: all 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group input:disabled {
          background: #f9fafb;
          cursor: not-allowed;
        }

        .password-input-wrapper {
          position: relative;
        }

        .password-input-wrapper input {
          padding-right: 48px;
        }

        .password-toggle {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: grid;
          place-items: center;
          color: #6b7280;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .password-toggle:hover {
          background: #f3f4f6;
          color: #111827;
        }

        .form-footer {
          margin-bottom: 24px;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
        }

        .remember-me input {
          width: auto;
          height: auto;
          margin: 0;
        }

        .admin-login-btn {
          width: 100%;
          height: 52px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .admin-login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .admin-login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .security-notice {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #fef3c7;
          border: 1px solid #fbbf24;
          border-radius: 8px;
          font-size: 13px;
          color: #92400e;
        }

        .security-notice .la {
          font-size: 18px;
          color: #f59e0b;
        }

        .security-notice p {
          margin: 0;
        }

        .back-to-site {
          text-align: center;
          margin-top: 20px;
        }

        .back-to-site a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: white;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .back-to-site a:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 480px) {
          .admin-login-card {
            padding: 32px 24px;
          }

          .admin-login-header h1 {
            font-size: 24px;
          }

          .form-footer {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLoginPage;
