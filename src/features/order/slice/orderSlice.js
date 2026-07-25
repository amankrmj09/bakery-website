import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderApi } from '../api/orderApi';

export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async (arg, { rejectWithValue }) => {
    try {
      const params = typeof arg === 'string' ? { userId: arg, page: 0, size: 5, isFiltered: false } : arg;
      const { userId, isFiltered = false, page = 0, size = 5 } = params;

      if (isFiltered) {
        const response = await orderApi.getUserOrders(userId);
        return { isFiltered: true, data: response };
      } else {
        const response = await orderApi.getUserOrdersPaginated({ userId, page, size });
        return { isFiltered: false, data: response };
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user orders'
      );
    }
  }
);

const initialState = {
  orders: [],
  isFiltered: false,
  pagination: {
    number: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload?.data !== undefined ? action.payload.data : action.payload;
        state.isFiltered = action.payload?.isFiltered || false;
        state.orders = payload?.content || payload || [];
        if (payload?.page) {
          state.pagination = payload.page;
        } else if (Array.isArray(payload)) {
          state.pagination = {
            number: 0,
            size: payload.length,
            totalElements: payload.length,
            totalPages: 1,
          };
        }
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError } = orderSlice.actions;

export default orderSlice.reducer;
