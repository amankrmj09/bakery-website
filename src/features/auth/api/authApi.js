import api from '../../../lib/axios';

export const authApi = {
  login: (credentials) => api.post('/api/v1/auth/login', credentials),
  verifyLogin: (data) => api.post('/api/v1/auth/login/verify', data),
  register: (userData) => api.post('/api/v1/auth/register', userData),
  verifyRegister: (data) => api.post('/api/v1/auth/register/verify', data),
  resendLoginOtp: (email) => api.post('/api/v1/auth/login/resend', { email }),
  resendRegisterOtp: (email) => api.post('/api/v1/auth/register/resend', { email }),
  forgotPassword: (data) => api.post('/api/v1/auth/forgot-password', data),
  resetPassword: (data) => api.post('/api/v1/auth/forgot-password/reset', data),
  logout: () => api.post('/api/v1/auth/logout')
};
