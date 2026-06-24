import api from '../../../lib/axios';

export const paymentApi = {
  createPayment: (payload) => api.post('/api/payments', payload)
};
