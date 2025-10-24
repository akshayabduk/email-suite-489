import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext.jsx';

/**
 * PUBLIC_INTERFACE
 * Register page with name, email, password.
 */
export default function Register() {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await register({ name, email, password });
      navigate('/', { replace: true });
    } catch (error) {
      setErr(error?.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Join MailPro and start organizing your email</p>
        {err && <div className="auth-error">{err}</div>}
        <form onSubmit={onSubmit} className="auth-form">
          <label>
            Name
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} required placeholder="Ada Lovelace" />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder="••••••••" />
          </label>
          <button type="submit" className="auth-button">Create account</button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
