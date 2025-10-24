import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './sidebar.css';

/**
 * PUBLIC_INTERFACE
 * Sidebar placeholder for mailbox folders and labels.
 */
export default function Sidebar() {
  const { pathname } = useLocation();
  const isActive = (path) => (pathname === path ? 'active' : '');

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h4 className="sidebar-title">Mailboxes</h4>
        <Link className={`sidebar-link ${isActive('/')}`} to="/">Inbox</Link>
        <Link className={`sidebar-link ${isActive('/sent')}`} to="/sent">Sent</Link>
        <Link className={`sidebar-link ${isActive('/drafts')}`} to="/drafts">Drafts</Link>
        <Link className={`sidebar-link ${isActive('/spam')}`} to="/spam">Spam</Link>
        <Link className={`sidebar-link ${isActive('/trash')}`} to="/trash">Trash</Link>
      </div>
      <div className="sidebar-section">
        <h4 className="sidebar-title">Labels</h4>
        <div className="label-chip">Work</div>
        <div className="label-chip">Personal</div>
        <div className="label-chip">Important</div>
      </div>
    </aside>
  );
}
