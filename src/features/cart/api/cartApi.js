import api from '../../../lib/axios';

export const cartApi = {
  fetchCartByUser: (userId) => api.get(`/api/carts/user/${userId}`),
  fetchCartBySession: (sessionId) => api.get(`/api/carts/session/${sessionId}`),
  addItem: (cartId, productId, quantity) => api.post(`/api/carts/${cartId}/items`, { productId, quantity }),
  updateItem: (cartId, itemId, quantity) => api.put(`/api/carts/${cartId}/items/${itemId}`, { quantity }),
  removeItem: (cartId, itemId) => api.delete(`/api/carts/${cartId}/items/${itemId}`),
  checkout: (cartId, checkoutData) => api.post(`/api/carts/${cartId}/checkout`, checkoutData)
};
