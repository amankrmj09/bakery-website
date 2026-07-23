import api from '../../../lib/axios';

export const authApi = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  verifyLogin: (data) => api.post('/api/auth/login/verify', data),
  register: (userData) => api.post('/api/auth/register', userData),
  verifyRegister: (data) => api.post('/api/auth/register/verify', data),
  logout: () => api.post('/api/auth/logout')
};
