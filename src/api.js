import axios from 'axios';

// Konfigurasi koneksi ke Vercel backend
const api = axios.create({
  baseURL: 'https://backend-melissa.vercel.app/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Otomatis menempelkan token ke setiap request yang keluar
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;
