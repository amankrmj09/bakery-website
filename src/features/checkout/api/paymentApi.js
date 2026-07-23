import api from '../../../lib/axios';

export const paymentApi = {
  createPayment: (payload) => api.post('/api/payments', payload),
  sendOtp: (paymentId) => api.post(`/api/payments/mock/${paymentId}/send-otp`),
  verifyOtp: (paymentId, otp) => api.post(`/api/payments/mock/${paymentId}/verify-otp`, { otp })
};
