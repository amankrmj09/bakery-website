import api from '../../../lib/axios';

export const cartApi = {
  fetchCartByUser: (userId) => api.get(`/api/v1/carts/user/${userId}`),
  fetchCartBySession: (sessionId) => api.get(`/api/v1/carts/session/${sessionId}`),
  addItem: (cartId, productId, quantity) => api.post(`/api/v1/carts/${cartId}/items`, { productId, quantity }),
  updateItem: (cartId, itemId, quantity) => api.put(`/api/v1/carts/${cartId}/items/${itemId}`, { quantity }),
  removeItem: (cartId, itemId) => api.delete(`/api/v1/carts/${cartId}/items/${itemId}`),
  updateCartDetails: (cartId, cartData) => api.patch(`/api/v1/carts/${cartId}`, cartData),
  checkout: (cartId, checkoutData) => api.post(`/api/v1/carts/${cartId}/checkout`, checkoutData)
};
