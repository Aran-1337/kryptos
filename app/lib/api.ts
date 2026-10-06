import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach bearer token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      let token: string | null = null;

      if (isAdminRoute) {
        // Admin context: Strictly check admin credentials
        const match = document.cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
        const cookieToken = match ? match[1] : null;
        token = cookieToken || localStorage.getItem('adminToken');
      } else {
        // Student / Public context: Strictly check student credentials
        token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      }

      // Attach token if valid and not a fake mock token
      if (token && token !== 'local_admin_dev_token' && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated responses
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Clear token only if on admin route
      if (window.location.pathname.startsWith('/admin')) {
        document.cookie = 'admin_token=; path=/; max-age=0; SameSite=Strict;';
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
