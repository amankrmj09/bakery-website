import { createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '../api/cartApi';

const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      let response;
      if (auth.user) {
        response = await cartApi.fetchCartByUser(auth.user.id);
      } else {
        response = await cartApi.fetchCartBySession(getSessionId());
      }
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch cart');
    }
  }
);

export const addItemToCart = createAsyncThunk(
  'cart/addItem',
  async ({ cartId, productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await cartApi.addItem(cartId, productId, quantity);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to add item to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ cartId, itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartApi.updateItem(cartId, itemId, quantity);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to update cart item');
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async ({ cartId, itemId }, { rejectWithValue }) => {
    try {
      const response = await cartApi.removeItem(cartId, itemId);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to remove cart item');
    }
  }
);

export const checkoutCart = createAsyncThunk(
  'cart/checkout',
  async ({ cartId, checkoutData }, { rejectWithValue }) => {
    try {
      const response = await cartApi.checkout(cartId, checkoutData);
      return response.data; 
    } catch (error) {
      return rejectWithValue('Checkout failed');
    }
  }
);
