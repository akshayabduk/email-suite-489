import axios from 'axios';

/**
 * Axios API client configured to talk to the backend.
 * - Base URL is read from REACT_APP_API_BASE (defaults to http://localhost:3001)
 * - Automatically attaches Authorization: Bearer <token> header if token exists
 * - Exposes helper methods for auth endpoints and mail operations.
 */
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
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

/**
 * PUBLIC_INTERFACE
 * Mail API encapsulates mailbox listing, message details, actions and labels.
 */
export const MailAPI = {
  // PUBLIC_INTERFACE
  list: async ({ mailbox = 'inbox', page = 0, size = 20, q = '', filters = {} }) => {
    /** Lists emails for a mailbox with pagination & query using backend's conventions. */
    const params = { page, size, q, ...filters };
    const { data } = await api.get(`/api/v1/emails/${mailbox}`, { params });
    return data;
  },
  // PUBLIC_INTERFACE
  get: async (id) => {
    /** Fetch a single email by id, including body/attachments. */
    const { data } = await api.get(`/api/v1/emails/${id}`);
    return data;
  },
  // PUBLIC_INTERFACE
  updateFlags: async (id, { read, starred, archived, deleted }) => {
    /** Update flags for a specific email */
    const { data } = await api.patch(`/api/v1/emails/${id}/flags`, { read, starred, archived, deleted });
    return data;
  },
  // PUBLIC_INTERFACE
  compose: async ({ to, cc = '', bcc = '', subject, bodyHtml = '', bodyText = '' }) => {
    /** Send email with backend schema */
    const payload = { to, cc, bcc, subject, bodyHtml, bodyText };
    const { data } = await api.post('/api/v1/emails/compose', payload);
    return data;
  },
  // PUBLIC_INTERFACE
  draft: async ({ to, cc = '', bcc = '', subject, bodyHtml = '', bodyText = '' }) => {
    /** Save draft using backend draft endpoint */
    const payload = { to, cc, bcc, subject, bodyHtml, bodyText };
    const { data } = await api.post('/api/v1/emails/draft', payload);
    return data;
  },
  // PUBLIC_INTERFACE
  uploadAttachment: async (emailId, files) => {
    /** Upload one or more files for a given email/draft id using backend endpoint */
    const form = new FormData();
    form.append('emailId', emailId);
    for (const f of files) form.append('files', f);
    const { data } = await api.post('/api/v1/attachments/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data; // [{ id, emailId, filename, ... }]
  },
};

// PUBLIC_INTERFACE
export const LabelsAPI = {
  /** Fetch user labels. */
  list: async () => {
    const { data } = await api.get('/api/v1/labels');
    return data; // [{id,name,color},...]
  }
};
