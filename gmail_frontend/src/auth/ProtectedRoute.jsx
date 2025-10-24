import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext.jsx';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute
 * - If authenticated, renders nested routes via <Outlet />
 * - Otherwise redirects to /login and preserves the intended location
 */
export default function ProtectedRoute() {
  const { token, ready } = useContext(AuthContext);
  const location = useLocation();

  if (!ready) return null; // can add loader if desired
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
