import { createSlice } from '@reduxjs/toolkit';
import { login, register, logout, verifyLogin, verifyRegister } from './authThunk';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  isOtpPending: false,
  pendingEmail: null,
  authType: null, // 'login' or 'register'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearOtpState: (state) => {
      state.isOtpPending = false;
      state.pendingEmail = null;
      state.authType = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isOtpPending = true;
        state.authType = 'login';
        // We get usernameOrEmail from meta.arg
        state.pendingEmail = action.meta.arg.usernameOrEmail; 
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isOtpPending = true;
        state.authType = 'register';
        state.pendingEmail = action.meta.arg.email;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyLogin.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(verifyLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.user = action.payload.user;
        state.isOtpPending = false;
        state.pendingEmail = null;
        state.authType = null;
      })
      .addCase(verifyLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyRegister.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(verifyRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.user = action.payload.user;
        state.isOtpPending = false;
        state.pendingEmail = null;
        state.authType = null;
      })
      .addCase(verifyRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError, clearOtpState } = authSlice.actions;
export default authSlice.reducer;
