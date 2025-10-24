import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext.jsx';

/**
 * PUBLIC_INTERFACE
 * Login page with email/password.
 */
export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      setErr(error?.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to continue to MailPro</p>
        {err && <div className="auth-error">{err}</div>}
        <form onSubmit={onSubmit} className="auth-form">
          <label>
            Email
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder="••••••••" />
          </label>
          <button type="submit" className="auth-button">Login</button>
        </form>
        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
