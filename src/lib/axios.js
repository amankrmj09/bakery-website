import axios from 'axios';

import { toast } from 'sonner';

// Uses the URL from the .env file (VITE_API_URL)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Some cart endpoints require X-Session-Id for guest checkout
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      config.headers['X-Session-Id'] = sessionId;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response || error.code === 'ERR_NETWORK') {
      toast.error('Backend API is not responding. Please try again later.');
    } else if (error.response.status >= 500) {
      toast.error('Server error occurred. Please try again later.');
    } else if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login handled by App routing or components
    }
    return Promise.reject(error);
  }
);

export default api;
