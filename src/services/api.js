import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_CANCELED' || error.name === 'AbortError' || error.name === 'CanceledError') {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
    }

    if (error.response?.status === 429) {
      error.friendlyMessage = 'Terlalu banyak permintaan. Silakan tunggu sebentar lalu coba lagi.';
    }

    return Promise.reject(error);
  }
);

export default api;
