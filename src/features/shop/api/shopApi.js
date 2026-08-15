import api from '../../../lib/axios';

export const shopApi = {
  fetchProducts: (params) => {
    let url = '/api/v1/products';
    const urlParams = new URLSearchParams();
    
    if (params?.categoryId) {
      url = `/api/v1/products/category/${params.categoryId}`;
    } else if (params?.query) {
      url = '/api/v1/products/search';
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
  fetchCategories: () => api.get('/api/v1/categories'),
  fetchTopCategoriesWithProducts: () => api.get('/api/v1/categories/top-with-products'),
  fetchStorefront: () => api.get('/api/v1/storefront/frontpage'),
  fetchProductReviews: (productId, params) => {
    let url = `/api/v1/engagement/reviews/product/${productId}`;
    
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
  submitReview: (productId, reviewData) => api.post(`/api/v1/engagement/reviews/product/${productId}`, reviewData),
  deleteReview: (productId, reviewId) => api.delete(`/api/v1/engagement/reviews/product/${productId}/${reviewId}`),
  reportReview: (productId, reviewId, reason) => api.post(`/api/v1/engagement/reviews/product/${productId}/${reviewId}/report`, { reason }),
  fetchProductById: (productId) => api.get(`/api/v1/products/${productId}`),
};


