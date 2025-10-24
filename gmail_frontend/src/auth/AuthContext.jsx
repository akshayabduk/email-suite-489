import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { AuthAPI } from '../api/client';

/**
 * PUBLIC_INTERFACE
 * AuthContext provides authentication state and helpers across the app.
 * - Stores token and user
 * - Persists token to localStorage
 * - Exposes login, register, logout, and a ready flag
 */
export const AuthContext = createContext({
  token: null,
  user: null,
  ready: false,
  login: async () => {},
  register: async () => {},
  logout: () => {}
});

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Load persisted auth on mount
  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    const u = localStorage.getItem(USER_KEY);
    if (t) setToken(t);
    if (u) {
      try {
        setUser(JSON.parse(u));
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }
    setReady(true);
  }, []);

  const persist = (t, u) => {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
  };

  const clear = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const login = useCallback(async (email, password) => {
    const data = await AuthAPI.login(email, password);
    const t = data?.token || data?.accessToken;
    const u = data?.user || null;
    setToken(t || null);
    setUser(u);
    if (t) persist(t, u);
    return { token: t, user: u };
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const data = await AuthAPI.register({ name, email, password });
    const t = data?.token || data?.accessToken;
    const u = data?.user || null;
    setToken(t || null);
    setUser(u);
    if (t) persist(t, u);
    return { token: t, user: u };
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    clear();
  }, []);

  const value = useMemo(() => ({ token, user, ready, login, register, logout }), [token, user, ready, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
