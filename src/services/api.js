import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 30000, // 30 detik default, override per-request untuk upload
  headers: {
    'Accept': 'application/json',
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

    // Timeout dari axios (ECONNABORTED)
    if (error.code === 'ECONNABORTED' && error.message?.includes('timeout')) {
      error.friendlyMessage = 'Server tidak merespon dalam waktu yang diharapkan. Silakan coba lagi.';
      return Promise.reject(error);
    }

    // Autentikasi
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
    }

    // Rate limiting
    if (error.response?.status === 429) {
      error.friendlyMessage = 'Terlalu banyak permintaan. Silakan tunggu sebentar lalu coba lagi.';
    }

    // Gateway errors (Vercel proxy / Cloudflare)
    if (error.response?.status === 502) {
      error.friendlyMessage = 'Server backend sedang sibuk atau tidak tersedia. Silakan coba lagi dalam beberapa saat.';
    }

    if (error.response?.status === 504) {
      error.friendlyMessage = 'Server backend kehabisan waktu memproses permintaan. Coba unggah gambar dengan ukuran lebih kecil.';
    }

    // Network error (no response at all)
    if (!error.response && error.code !== 'ERR_CANCELED') {
      error.friendlyMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet kamu.';
    }

    return Promise.reject(error);
  }
);

export default api;
