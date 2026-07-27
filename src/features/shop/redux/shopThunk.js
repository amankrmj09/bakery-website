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

export const fetchStorefront = createAsyncThunk(
  'shop/fetchStorefront',
  async (_, { rejectWithValue }) => {
    try {
      const response = await shopApi.fetchStorefront();
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch site config');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'shop/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await shopApi.fetchProductById(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch product');
    }
  }
);

export const fetchProductReviews = createAsyncThunk(
  'shop/fetchProductReviews',
  async ({ productId, params }, { rejectWithValue }) => {
    try {
      const response = await shopApi.fetchProductReviews(productId, params);
      return { productId, reviews: response.data, params };
    } catch (error) {
      return rejectWithValue('Failed to fetch reviews');
    }
  }
);

export const submitReview = createAsyncThunk(
  'shop/submitReview',
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await shopApi.submitReview(productId, reviewData);
      return { productId, review: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit review');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'shop/deleteReview',
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      await shopApi.deleteReview(productId, reviewId);
      return { productId, reviewId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

export const reportReview = createAsyncThunk(
  'shop/reportReview',
  async ({ productId, reviewId, reason }, { rejectWithValue }) => {
    try {
      await shopApi.reportReview(productId, reviewId, reason);
      return { productId, reviewId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to report review');
    }
  }
);
