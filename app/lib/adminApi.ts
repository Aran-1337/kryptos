import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const match = document.cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
    const cookieToken = match ? match[1] : null;
    const token = cookieToken || localStorage.getItem('adminToken');
    if (token && token !== 'local_admin_dev_token' && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      document.cookie = 'admin_token=; path=/; max-age=0; SameSite=Strict;';
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export const adminLogin = (data: { email: string; password: string }) =>
  API.post('/auth/login', data);

export const getDashboardStats = () => API.get('/dashboard/stats');
export const getMyCourses = () => API.get('/dashboard/my-courses');

export const getCourses = (params?: object) => API.get('/courses', { params });
export const createCourse = (data: FormData) => API.post('/courses', data);
export const updateCourse = (id: string, data: FormData) => API.patch(`/courses/${id}`, data);
export const deleteCourse = (id: string) => API.delete(`/courses/${id}`);

export const getStudents = (params?: object) => API.get('/users', { params: { role: 'student', ...params } });
export const getStudent = (id: string) => API.get(`/users/${id}`);
export const sendMessageToStudent = (id: string, data: object) => API.post(`/users/${id}/message`, data);

export const getOrders = (params?: object) => API.get('/orders', { params });

export const getQuizzes = (courseId: string) => API.get(`/courses/${courseId}/quizzes`);
export const createQuiz = (courseId: string, data: object) => API.post(`/courses/${courseId}/quizzes`, data);

export const getNotifications = () => API.get('/notifications');
export const sendNotification = (data: object) => API.post('/notifications', data);

export const getLiveSessions = () => API.get('/live-sessions');
export const createLiveSession = (data: object) => API.post('/live-sessions', data);
export const updateLiveSession = (id: string, data: object) => API.patch(`/live-sessions/${id}`, data);
export const deleteLiveSession = (id: string) => API.delete(`/live-sessions/${id}`);

export const getCertificates = () => API.get('/certificates');

export const getReviews = (courseId: string) => API.get(`/courses/${courseId}/reviews`);

export const uploadFile = (data: FormData) => API.post('/uploads', data);

export const getProfile = () => API.get('/users/profile');
export const updateProfile = (data: FormData | object) => API.patch('/users/profile', data);
export const changePassword = (data: object) => API.patch('/auth/change-password', data);

export default API;
