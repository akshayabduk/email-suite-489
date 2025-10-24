import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Mailbox from './pages/Mailbox.jsx';
import Labels from './pages/Labels.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Mailbox mailbox="inbox" title="Inbox" />} />
        <Route path="/sent" element={<Mailbox mailbox="sent" title="Sent" />} />
        <Route path="/drafts" element={<Mailbox mailbox="drafts" title="Drafts" />} />
        <Route path="/archived" element={<Mailbox mailbox="archived" title="Archived" />} />
        <Route path="/trash" element={<Mailbox mailbox="trash" title="Trash" />} />
        <Route path="/labels" element={<Labels />} />
        <Route path="/labels/:labelId" element={<Labels />} />
        <Route path="/settings" element={<div className="content-inner"><h2>Settings</h2></div>} />
        <Route path="/compose" element={<div className="content-inner"><h2>Compose</h2></div>} />
      </Route>

      <Route path="*" element={<div className="content-inner"><h2>Not Found</h2></div>} />
    </Routes>
  );
}
