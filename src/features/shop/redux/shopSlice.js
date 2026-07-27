import { createSlice } from '@reduxjs/toolkit';
import { fetchProducts, fetchCategories, fetchStorefront, fetchProductReviews, submitReview, deleteReview } from './shopThunk';

const getCachedCategories = () => {
  try {
    const item = localStorage.getItem('bakery_menu_categories');
    if (!item) return [];
    const parsed = JSON.parse(item);
    const now = Date.now();
    if (now - parsed.timestamp > 300000) { // 5 mins TTL
      localStorage.removeItem('bakery_menu_categories');
      return [];
    }
    return parsed.data;
  } catch (e) {
    return [];
  }
};

const initialState = {
  products: {
    data: [],
    pagination: null,
    loading: false,
    error: null,
  },
  categories: {
    data: getCachedCategories(),
    error: null,
  },
  storefront: {
    data: null,
    loading: false,
    error: null,
  },
  reviews: {
    data: {}, // { productId: [reviews] }
    loading: false,
    error: null,
  }
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.products.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products.loading = false;
        const payload = action.payload;
        state.products.data = Array.isArray(payload) ? payload : (payload?.content || payload?._embedded?.productResponseList || payload?.data || []);
        
        if (payload?.page) {
            state.products.pagination = {
                number: payload.page.number,
                size: payload.page.size,
                totalElements: payload.page.totalElements,
                totalPages: payload.page.totalPages
            };
        } else if (payload && typeof payload.totalPages !== 'undefined') {
            state.products.pagination = {
                number: payload.number,
                size: payload.size,
                totalElements: payload.totalElements,
                totalPages: payload.totalPages
            };
        } else {
            state.products.pagination = null;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload;
      })
      .addCase(fetchCategories.pending, (state) => { state.categories.loading = true; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.loading = false;
        const payload = action.payload;
        state.categories.data = Array.isArray(payload) ? payload : (payload?.content || []);
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories.loading = false;
        state.categories.error = action.payload;
      })
      .addCase(fetchStorefront.pending, (state) => { state.storefront.loading = true; })
      .addCase(fetchStorefront.fulfilled, (state, action) => {
        state.storefront.loading = false;
        state.storefront.data = action.payload;
      })
      .addCase(fetchStorefront.rejected, (state, action) => {
        state.storefront.loading = false;
        state.storefront.error = action.payload;
      })
      .addCase(fetchProductReviews.pending, (state) => { state.reviews.loading = true; })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.reviews.loading = false;
        state.reviews.data[action.payload.productId] = action.payload.reviews;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.reviews.loading = false;
        state.reviews.error = action.payload;
      })
      .addCase(submitReview.pending, (state) => { state.reviews.loading = true; })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.reviews.loading = false;
        const { productId, review } = action.payload;
        if (!state.reviews.data[productId]) {
          state.reviews.data[productId] = [];
        }
        // Check if user already reviewed (if editing)
        const index = state.reviews.data[productId].findIndex(r => r.id === review.id);
        if (index >= 0) {
          state.reviews.data[productId][index] = review;
        } else {
          state.reviews.data[productId].push(review);
        }
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.reviews.loading = false;
        state.reviews.error = action.payload;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        const { productId, reviewId } = action.payload;
        if (state.reviews.data[productId]) {
          state.reviews.data[productId] = state.reviews.data[productId].filter(r => r.id !== reviewId);
        }
      });
  },
});

export default shopSlice.reducer;



