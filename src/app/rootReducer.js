import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/redux/authSlice';
import shopReducer from '../features/shop/redux/shopSlice';
import cartReducer from '../features/cart/redux/cartSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  shop: shopReducer,
  cart: cartReducer,
});

export default rootReducer;
