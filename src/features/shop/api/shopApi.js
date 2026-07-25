import api from '../../../lib/axios';

export const shopApi = {
  fetchProducts: (params) => {
    let url = '/api/products';
    if (params?.categoryId) {
      url = `/api/products/category/${params.categoryId}`;
    } else if (params?.query) {
      url = `/api/products/search?query=${params.query}`;
    }
    return api.get(url);
  },
  fetchCategories: () => api.get('/api/categories'),
  fetchTopCategoriesWithProducts: () => api.get('/api/categories/top-with-products'),
  fetchStorefront: () => api.get('/api/storefront/frontpage'),
  fetchProductReviews: (productId) => api.get(`/api/products/${productId}/reviews`),
  submitReview: (productId, reviewData) => api.post(`/api/products/${productId}/reviews`, reviewData),
  deleteReview: (productId, reviewId) => api.delete(`/api/products/${productId}/reviews/${reviewId}`),
  reportReview: (productId, reviewId, reason) => api.post(`/api/products/${productId}/reviews/${reviewId}/report`, { reason }),
};


