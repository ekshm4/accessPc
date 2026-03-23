const { VITE_URL } = import.meta.env;

const API_BASE = VITE_URL || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeItem('token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      'ngrok-skip-browser-warning': 'true',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (response.status === 401) {
    removeToken();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

export const auth = {
  login: async (username, password) => {
    const data = await api.post('/api/auth/signin', { username, password });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },
  
  register: async (username, email, password) => {
    return api.post('/api/auth/register', { username, email, password });
  },
  
  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      removeToken();
    }
  },
  
  isAuthenticated: () => !!getToken(),
};

export const media = {
  getVideos: () => api.get('/api/media/videos'),
  getAudios: () => api.get('/api/media/audios'),
  getImages: () => api.get('/api/media/images'),
  getDocuments: () => api.get('/api/media/documents'),
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/media/all${query ? `?${query}` : ''}`);
  },
};

export const folders = {
  scan: () => api.post('/api/scan/scan'),
  getAll: (parentId = null) => {
    const query = parentId ? `?parentId=${parentId}` : '';
    return api.get(`/api/scan/folders${query}`);
  },
  getById: (id) => api.get(`/api/scan/folders/${id}`),
  getFiles: (id, type) => {
    const query = type ? `?type=${type}` : '';
    return api.get(`/api/scan/folders/${id}/files${query}`);
  },
};

export const stats = {
  getDashboard: () => api.get('/api/stats'),
  getRecent: (limit = 10) => api.get(`/api/stats/recent?limit=${limit}`),
};

export const history = {
  get: (limit = 20) => api.get(`/api/history?limit=${limit}`),
  updateProgress: (mediaFileId, progress, completed = false) => 
    api.post('/api/history/progress', { mediaFileId, progress, completed }),
  delete: (mediaFileId) => api.delete(`/api/history/${mediaFileId}`),
  clear: () => api.delete('/api/history'),
};

export const user = {
  getProfile: () => api.get('/api/user'),
  getSessions: () => api.get('/api/user/sessions'),
};

export const stream = {
  getVideoUrl: (filename) => `${API_BASE}/stream/video?path=${encodeURIComponent(filename)}`,
  getAudioUrl: (filename) => `${API_BASE}/stream/audio?path=${encodeURIComponent(filename)}`,
  getImageUrl: (filename) => `${API_BASE}/stream/image?path=${encodeURIComponent(filename)}`,
  getDocumentUrl: (filename) => `${API_BASE}/stream/document?path=${encodeURIComponent(filename)}`,
};

export { getToken, setToken, removeToken, API_BASE };
