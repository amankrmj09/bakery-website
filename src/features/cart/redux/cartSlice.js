import { createSlice } from '@reduxjs/toolkit';
import { fetchCart, addItemToCart, updateCartItem, removeCartItem, checkoutCart, updateCartDetails } from './cartThunk';
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
    },
    updateQuantityLocally: (state, action) => {
      const { itemId, quantity } = action.payload;
      if (state.cart && state.cart.items) {
        const item = state.cart.items.find(i => i.id === itemId);
        if (item) {
          item.quantity = quantity;
          item.totalPrice = item.unitPrice * quantity;
          // Note: Cart total will be updated perfectly by backend after debounce
        }
      }
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
      .addCase(updateCartDetails.fulfilled, (state, action) => {
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

export const { clearCheckoutState, updateQuantityLocally } = cartSlice.actions;
export default cartSlice.reducer;
