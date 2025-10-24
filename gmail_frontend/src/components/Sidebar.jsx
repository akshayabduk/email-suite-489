import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './sidebar.css';
import { LabelsAPI } from '../api/client';

/**
 * PUBLIC_INTERFACE
 * Sidebar listing mailbox folders and dynamic user labels from backend.
 */
export default function Sidebar() {
  const { pathname } = useLocation();
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    let alive = true;
    LabelsAPI.list()
      .then((data) => { if (alive) setLabels(data || []); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const isActive = (path) => (pathname === path ? 'active' : '');

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h4 className="sidebar-title">Mailboxes</h4>
        <Link className={`sidebar-link ${isActive('/')}`} to="/">Inbox</Link>
        <Link className={`sidebar-link ${isActive('/sent')}`} to="/sent">Sent</Link>
        <Link className={`sidebar-link ${isActive('/drafts')}`} to="/drafts">Drafts</Link>
        <Link className={`sidebar-link ${isActive('/archived')}`} to="/archived">Archived</Link>
        <Link className={`sidebar-link ${isActive('/trash')}`} to="/trash">Trash</Link>
      </div>
      <div className="sidebar-section">
        <h4 className="sidebar-title">Labels</h4>
        {labels.length === 0 && <div className="muted small">No labels</div>}
        <div className="labels-list">
          {labels.map((l) => (
            <NavLink
              key={l.id}
              to={`/labels/${l.id}`}
              className={({ isActive }) =>
                `label-chip ${isActive ? 'active' : ''}`
              }
              style={{ borderColor: l.color || undefined }}
              title={l.name}
            >
              {l.name}
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
}
