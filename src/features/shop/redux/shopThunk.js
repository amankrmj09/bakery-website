import { createAsyncThunk } from '@reduxjs/toolkit';
import { shopApi } from '../api/shopApi';

export const fetchProducts = createAsyncThunk(
  'shop/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await shopApi.fetchProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch products');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'shop/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await shopApi.fetchCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch categories');
    }
  }
);
