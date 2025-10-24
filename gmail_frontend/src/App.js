import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import AppRoutes from './routes.jsx';

/**
 * PUBLIC_INTERFACE
 * App root layout with theme toggler, header, sidebar and content area.
 */
export default function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app-shell">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="content">
          <div className="theme-toggle-wrap">
            <button
              className="theme-toggle"
              onClick={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}
