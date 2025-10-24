import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function Home() {
  return (
    <div className="content-inner">
      <h2>Inbox</h2>
      <p>Welcome to your mailbox. This is a protected route.</p>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home/>} />
        <Route path="/sent" element={<div className="content-inner"><h2>Sent</h2></div>} />
        <Route path="/drafts" element={<div className="content-inner"><h2>Drafts</h2></div>} />
        <Route path="/spam" element={<div className="content-inner"><h2>Spam</h2></div>} />
        <Route path="/trash" element={<div className="content-inner"><h2>Trash</h2></div>} />
        <Route path="/settings" element={<div className="content-inner"><h2>Settings</h2></div>} />
        <Route path="/compose" element={<div className="content-inner"><h2>Compose</h2></div>} />
      </Route>

      <Route path="*" element={<div className="content-inner"><h2>Not Found</h2></div>} />
    </Routes>
  );
}
