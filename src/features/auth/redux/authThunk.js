import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return response.data; // Just returns { message: "OTP Sent..." }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const verifyLogin = createAsyncThunk(
  'auth/verifyLogin',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyLogin(data);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response.data; // Just returns { message: "OTP Sent..." }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const verifyRegister = createAsyncThunk(
  'auth/verifyRegister',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyRegister(data);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn('Logout API failed, proceeding to clear local state');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return null;
  }
);
