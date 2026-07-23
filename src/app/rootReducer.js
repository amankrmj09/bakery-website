import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/redux/authSlice';
import shopReducer from '../features/shop/redux/shopSlice';
import cartReducer from '../features/cart/redux/cartSlice';
import orderReducer from '../features/order/slice/orderSlice';
import addressReducer from '../features/user/redux/addressSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  shop: shopReducer,
  cart: cartReducer,
  order: orderReducer,
  address: addressReducer,
});

export default rootReducer;
