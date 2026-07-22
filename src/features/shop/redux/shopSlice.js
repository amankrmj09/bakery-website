import { createSlice } from '@reduxjs/toolkit';
import { fetchProducts, fetchCategories, fetchstorefront } from './shopThunk';

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
      .addCase(fetchstorefront.pending, (state) => { state.storefront.loading = true; })
      .addCase(fetchstorefront.fulfilled, (state, action) => {
        state.storefront.loading = false;
        state.storefront.data = action.payload;
      })
      .addCase(fetchstorefront.rejected, (state, action) => {
        state.storefront.loading = false;
        state.storefront.error = action.payload;
      });
  },
});

export default shopSlice.reducer;


