import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext.jsx';
import './header.css';

/**
 * PUBLIC_INTERFACE
 * Header component with app title, navigation, and auth controls.
 */
export default function Header() {
  const { token, user, logout } = useContext(AuthContext);

  return (
    <header className="app-header">
      <div className="header-left">
        <Link to="/" className="brand">MailPro</Link>
      </div>
      <nav className="header-nav">
        {token ? (
          <>
            <Link to="/" className="nav-link">Inbox</Link>
            <Link to="/compose" className="nav-link">Compose</Link>
            <Link to="/settings" className="nav-link">Settings</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link primary">Register</Link>
          </>
        )}
      </nav>
      <div className="header-right">
        {token && (
          <>
            <span className="user-chip">{user?.name || user?.email || 'Account'}</span>
            <button className="btn small" onClick={logout} aria-label="Logout">Logout</button>
          </>
        )}
      </div>
    </header>
  );
}
