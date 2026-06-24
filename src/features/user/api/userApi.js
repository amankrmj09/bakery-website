import api from '../../../lib/axios';

export const userApi = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (profileData) => api.put('/api/users/profile', profileData),
  changePassword: (passwordData) => api.post('/api/auth/change-password', passwordData)
};
