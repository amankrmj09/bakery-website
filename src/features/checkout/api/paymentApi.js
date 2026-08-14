import api from '../../../lib/axios';

export const paymentApi = {
  createPayment: (payload) => api.post('/api/v1/payments', payload),
  sendOtp: (paymentId) => api.post(`/api/v1/payments/mock/${paymentId}/send-otp`),
  verifyOtp: (paymentId, otp) => api.post(`/api/v1/payments/mock/${paymentId}/verify-otp`, { otp }),
  resendOtp: (paymentId) => api.post(`/api/v1/payments/mock/${paymentId}/resend-otp`),
  getPaymentById: (paymentId) => api.get(`/api/v1/payments/${paymentId}`),
};
