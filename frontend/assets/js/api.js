// ANBI Tech Solution - API Utilities
const API_BASE = (() => {
  const hostname = location.hostname;
  if (hostname === 'anbi-tech.onrender.com') return '/api';
  return 'https://anbi-tech.onrender.com/api';
})();

const API = {
  base: API_BASE,

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = { ...options.headers };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(this.base + endpoint, { ...options, headers });

    // Handle 401 unauthorized - token expired or invalid
    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'https://anbi-tech.onrender.com/login.html';
      return;
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || `Request failed (${res.status})`);
    }

    return data;
  },

  get(endpoint) {
    return this.request(endpoint);
  },

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  publicPost(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async upload(endpoint, fieldName, file) {
    const formData = new FormData();
    formData.append(fieldName, file);
    return this.request(endpoint, {
      method: 'POST',
      body: formData,
    });
  },
};
