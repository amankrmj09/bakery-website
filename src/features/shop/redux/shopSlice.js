import { createSlice } from '@reduxjs/toolkit';
import { fetchProducts, fetchCategories, fetchStorefront, fetchProductReviews, submitReview } from './shopThunk';

const initialState = {
  products: {
    data: [],
    loading: false,
    error: null,
  },
  categories: {
    data: [],
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
        state.products.data = action.payload?.content || action.payload || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload;
      })
      .addCase(fetchCategories.pending, (state) => { state.categories.loading = true; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.loading = false;
        state.categories.data = action.payload?.content || action.payload || [];
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
      });
  },
});

export default shopSlice.reducer;



