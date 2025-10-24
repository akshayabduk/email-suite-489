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
  list: async ({ mailbox = 'inbox', page = 1, pageSize = 20, query = '', filters = {} }) => {
    /** Lists emails for a mailbox with pagination, query and lightweight filters. */
    const params = { page, pageSize, q: query, ...filters };
    const { data } = await api.get(`/api/v1/mail/${mailbox}`, { params });
    return data; // {items:[], total: n}
  },
  // PUBLIC_INTERFACE
  get: async (id) => {
    /** Fetch a single email by id, including body/attachments. */
    const { data } = await api.get(`/api/v1/mail/${id}`);
    return data;
  },
  // PUBLIC_INTERFACE
  toggleRead: async (ids, read = true) => {
    /** Mark one or multiple emails as read/unread. */
    const { data } = await api.post(`/api/v1/mail/actions/read`, { ids, read });
    return data;
  },
  // PUBLIC_INTERFACE
  toggleStar: async (ids, starred = true) => {
    /** Star / unstar emails. */
    const { data } = await api.post(`/api/v1/mail/actions/star`, { ids, starred });
    return data;
  },
  // PUBLIC_INTERFACE
  archive: async (ids) => {
    /** Archive emails. */
    const { data } = await api.post(`/api/v1/mail/actions/archive`, { ids });
    return data;
  },
  // PUBLIC_INTERFACE
  delete: async (ids) => {
    /** Move emails to trash. */
    const { data } = await api.post(`/api/v1/mail/actions/delete`, { ids });
    return data;
  },
  // PUBLIC_INTERFACE
  restore: async (ids) => {
    /** Restore emails from trash/archive to inbox. */
    const { data } = await api.post(`/api/v1/mail/actions/restore`, { ids });
    return data;
  },
  // PUBLIC_INTERFACE
  moveToLabel: async (ids, labelId) => {
    /** Apply/move emails to a label. */
    const { data } = await api.post(`/api/v1/mail/actions/move`, { ids, labelId });
    return data;
  },
  // PUBLIC_INTERFACE
  compose: async ({ to, subject, body, attachments = [] }) => {
    /** Send email: POST /api/v1/emails/compose with JSON. Attachments should already be uploaded and referenced by IDs if backend requires. */
    const payload = { to, subject, body, attachments };
    const { data } = await api.post('/api/v1/emails/compose', payload);
    return data;
  },
  // PUBLIC_INTERFACE
  saveDraft: async ({ to, subject, body, attachments = [], id } = {}) => {
    /** Save draft: POST /api/v1/emails/draft with JSON. Returns draft info including id to attach files. */
    const payload = { to, subject, body, attachments, id };
    const { data } = await api.post('/api/v1/emails/draft', payload);
    return data;
  },
  // PUBLIC_INTERFACE
  uploadAttachment: async (file, { draftId } = {}) => {
    /** Upload attachment via multipart form-data. When draftId is provided, associates with the draft on backend. */
    const form = new FormData();
    form.append('file', file);
    if (draftId) form.append('draftId', draftId);
    const { data } = await api.post('/api/v1/attachments', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data; // { id, filename, size, url? }
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
