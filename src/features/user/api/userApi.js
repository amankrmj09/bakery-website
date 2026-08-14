import api from '../../../lib/axios';

export const userApi = {
  getProfile: () => api.get('/api/v1/users/profile'),
  updateProfile: (profileData) => api.put('/api/v1/users/profile', profileData),
  changePassword: (passwordData) => api.post('/api/v1/auth/change-password', passwordData)
};
