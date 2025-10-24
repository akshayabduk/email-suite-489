import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext.jsx';
import './header.css';
import ComposeModal from './ComposeModal.jsx';

/**
 * PUBLIC_INTERFACE
 * Header component with app title, navigation, and auth controls.
 * Adds a Compose button and 'c' keyboard shortcut to open ComposeModal.
 */
export default function Header() {
  const { token, user, logout } = useContext(AuthContext);
  const [composeOpen, setComposeOpen] = useState(false);

  useEffect(() => {
    if (!token) return;
    const onKey = (e) => {
      if (e.target && ['INPUT','TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key?.toLowerCase() === 'c') {
        e.preventDefault();
        setComposeOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [token]);

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <Link to="/" className="brand">MailPro</Link>
        </div>
        <nav className="header-nav">
          {token ? (
            <>
              <Link to="/" className="nav-link">Inbox</Link>
              <Link to="/sent" className="nav-link">Sent</Link>
              <Link to="/archived" className="nav-link">Archived</Link>
              <Link to="/labels" className="nav-link">Labels</Link>
              <button className="nav-link primary" onClick={() => setComposeOpen(true)}>Compose</button>
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

      {/* Compose Modal */}
      {token && (
        <ComposeModal
          open={composeOpen}
          onClose={() => setComposeOpen(false)}
          onSent={() => {
            // Optionally: trigger refresh signals via StorageEvent or custom event
            // For simplicity, reload to reflect Sent/Inbox updates
            try {
              // Dispatch a custom event other components can listen to for refresh
              window.dispatchEvent(new Event('mail:refresh'));
            } catch {}
            setComposeOpen(false);
          }}
          onDraftSaved={() => {
            try { window.dispatchEvent(new Event('mail:refresh')); } catch {}
          }}
        />
      )}
    </>
  );
}
