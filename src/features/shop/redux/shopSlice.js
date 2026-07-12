import { createSlice } from '@reduxjs/toolkit';
import { fetchProducts, fetchCategories, fetchSiteConfig } from './shopThunk';

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
  siteConfig: {
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
        state.products.data = action.payload || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload;
      })
      .addCase(fetchCategories.pending, (state) => { state.categories.loading = true; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.loading = false;
        state.categories.data = action.payload || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories.loading = false;
        state.categories.error = action.payload;
      })
      .addCase(fetchSiteConfig.pending, (state) => { state.siteConfig.loading = true; })
      .addCase(fetchSiteConfig.fulfilled, (state, action) => {
        state.siteConfig.loading = false;
        state.siteConfig.data = action.payload;
      })
      .addCase(fetchSiteConfig.rejected, (state, action) => {
        state.siteConfig.loading = false;
        state.siteConfig.error = action.payload;
      });
  },
});

export default shopSlice.reducer;
