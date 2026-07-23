import axiosInstance from '../../../lib/axios';

const BASE_URL = 'http://bakery-api.blubug.me/api/orders';

export const orderApi = {
  getUserOrders: async (userId) => {
    const response = await axiosInstance.get(`${BASE_URL}/user/${userId}`);
    return response.data;
  },

  getOrderById: async (orderId) => {
    const response = await axiosInstance.get(`${BASE_URL}/${orderId}`);
    return response.data;
  },
  
  cancelOrder: async (orderId, reason) => {
    const response = await axiosInstance.post(`${BASE_URL}/${orderId}/cancel`, null, {
        params: { reason }
    });
    return response.data;
  }
};
