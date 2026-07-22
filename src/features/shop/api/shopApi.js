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
  fetchStorefront: () => api.get('/api/storefront/frontpage'),
};


