// components/auth/FormContent.jsx
'use client';

import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  registerCleaner,
  registerEmployer,
  resetRegisterState,
} from '@/store/slices/registerSlice';

const FormContent = ({ role = 'cleaner' }) => {
  const dispatch = useDispatch();
  const { cleanerLoading, cleanerError, employerLoading, employerError } =
    useSelector((s) => s.register);

  const isCleaner = role === 'cleaner';
  const loading = isCleaner ? cleanerLoading : employerLoading;
  const error = isCleaner ? cleanerError : employerError;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const bs = useMemo(
    () => (typeof window !== 'undefined' ? window.bootstrap : null),
    []
  );

  const closeRegisterOpenLogin = () => {
    try {
      const reg = document.getElementById('registerModal');
      if (bs && reg) {
        const inst = bs.Modal.getInstance(reg) || new bs.Modal(reg);
        inst.hide();
      }
      const login = document.getElementById('loginPopupModal');
      if (bs && login) {
        const inst2 = bs.Modal.getInstance(login) || new bs.Modal(login);
        inst2.show();
      }
    } catch {}
  };

  const firstError = (obj) => {
    if (!obj) return '';
    if (Array.isArray(obj)) return obj[0];
    if (typeof obj === 'object') return firstError(obj[Object.keys(obj)[0]]);
    return String(obj);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email and password are required');
      return;
    }

    const action = isCleaner ? registerCleaner : registerEmployer;
    const res = await dispatch(action({ email, password }));

    if (action.fulfilled.match(res)) {
      toast.success('Account created! Check your email to activate.');
      setEmail('');
      setPassword('');
      dispatch(resetRegisterState());
      closeRegisterOpenLogin();
    } else {
      toast.error(firstError(res.payload) || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          id="password-field"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <button className="theme-btn btn-style-one" type="submit" disabled={loading}>
          {loading ? 'Registering…' : 'Register'}
        </button>
      </div>

      {!!error && (
        <div className="text-danger" style={{ marginTop: 8 }}>
          {typeof error === 'string' ? error : 'Registration error'}
        </div>
      )}
    </form>
  );
};

export default FormContent;
