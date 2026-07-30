import api from '../../../lib/axios';

export const authApi = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  verifyLogin: (data) => api.post('/api/auth/login/verify', data),
  register: (userData) => api.post('/api/auth/register', userData),
  verifyRegister: (data) => api.post('/api/auth/register/verify', data),
  resendLoginOtp: (email) => api.post('/api/auth/login/resend', { email }),
  resendRegisterOtp: (email) => api.post('/api/auth/register/resend', { email }),
  forgotPassword: (data) => api.post('/api/auth/forgot-password', data),
  resetPassword: (data) => api.post('/api/auth/forgot-password/reset', data),
  logout: () => api.post('/api/auth/logout')
};
