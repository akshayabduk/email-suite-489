import axios from 'axios';

/**
 * Axios API client configured to talk to the backend.
 * - Base URL is read from REACT_APP_API_BASE (defaults to http://localhost:3001)
 * - Automatically attaches Authorization: Bearer <token> header if token exists
 * - Exposes helper methods for auth endpoints.
 */
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true
});

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    };
  }
  return config;
});

export default api;

// PUBLIC_INTERFACE
export const AuthAPI = {
  /** Login with email and password. Returns token/user on success. */
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  /** Register new user. Returns token/user on success. */
  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },
  /** Example: fetch current user profile */
  me: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  }
};
