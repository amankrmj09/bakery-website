import { createSlice } from '@reduxjs/toolkit';
import { fetchCart, addItemToCart, updateCartItem, removeCartItem, checkoutCart } from './cartThunk';
import { logout } from '../../auth/redux/authThunk';

const initialState = {
  cart: null,
  loading: false,
  error: null,
  checkoutState: {
    loading: false,
    orderId: null,
    error: null
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCheckoutState: (state) => {
      state.checkoutState = { loading: false, orderId: null, error: null };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(checkoutCart.pending, (state) => {
        state.checkoutState.loading = true;
        state.checkoutState.error = null;
      })
      .addCase(checkoutCart.fulfilled, (state, action) => {
        state.checkoutState.loading = false;
        state.checkoutState.orderId = action.payload.orderId;
        state.cart = null; 
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.checkoutState.loading = false;
        state.checkoutState.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.cart = null;
        state.checkoutState = { loading: false, orderId: null, error: null };
      });
  },
});

export const { clearCheckoutState } = cartSlice.actions;
export default cartSlice.reducer;
