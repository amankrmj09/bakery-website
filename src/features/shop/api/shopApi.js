import api from '../../../lib/axios';

export const shopApi = {
  fetchProducts: (params) => {
    let url = '/api/products';
    const urlParams = new URLSearchParams();
    
    if (params?.categoryId) {
      url = `/api/products/category/${params.categoryId}`;
    } else if (params?.query) {
      url = '/api/products/search';
      urlParams.append('query', params.query);
    }
    
    if (params?.page !== undefined) urlParams.append('page', params.page);
    if (params?.size !== undefined) urlParams.append('size', params.size);
    if (params?.sortBy) {
        const [sortField, sortDir] = params.sortBy.split('_');
        if (sortField) urlParams.append('sortBy', sortField);
        if (sortDir) urlParams.append('sortDir', sortDir.toUpperCase());
    }
    
    const queryString = urlParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    return api.get(url);
  },
  fetchCategories: () => api.get('/api/categories'),
  fetchTopCategoriesWithProducts: () => api.get('/api/categories/top-with-products'),
  fetchStorefront: () => api.get('/api/storefront/frontpage'),
  fetchProductReviews: (productId, params) => {
    let url = `/api/products/${productId}/reviews`;
    
    if (params) {
        const urlParams = new URLSearchParams();
        if (params.page !== undefined) urlParams.append('page', params.page);
        if (params.size !== undefined) urlParams.append('size', params.size);
        if (params.sortBy) {
            const [sortField, sortDir] = params.sortBy.split('_');
            if (sortField) urlParams.append('sortBy', sortField);
            if (sortDir) urlParams.append('sortDir', sortDir.toUpperCase());
        }
        const queryString = urlParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }
    
    return api.get(url);
  },
  submitReview: (productId, reviewData) => api.post(`/api/products/${productId}/reviews`, reviewData),
  deleteReview: (productId, reviewId) => api.delete(`/api/products/${productId}/reviews/${reviewId}`),
  reportReview: (productId, reviewId, reason) => api.post(`/api/products/${productId}/reviews/${reviewId}/report`, { reason }),
  fetchProductById: (productId) => api.get(`/api/products/${productId}`),
};


