import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const AUTH_TOKEN_KEY = 'token';
const AUTH_REFRESH_KEY = 'refreshToken';
const AUTH_USER_KEY = 'petcare_user';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Đính kèm mã Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Xử lý lỗi tập trung phía Client
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    // 1. Xử lý khi phiên đăng nhập hết hạn
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_REFRESH_KEY);
      localStorage.removeItem(AUTH_USER_KEY);

      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login';
      }
    }

    // ĐÃ THÊM: Bóc tách chuỗi lỗi tiếng Việt từ Backend errorHandler gánh vác
    // Giúp Component chỉ cần gọi error.message là lấy được thông báo chuẩn hiển thị UI
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }

    return Promise.reject(error);
  }
);

export default api;