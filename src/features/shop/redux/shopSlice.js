import { createSlice } from '@reduxjs/toolkit';
import { fetchProducts, fetchCategories } from './shopThunk';

const initialState = {
  products: {
    data: [],
    loading: false,
    error: null,
  },
  categories: {
    data: [],
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
      });
  },
});

export default shopSlice.reducer;
