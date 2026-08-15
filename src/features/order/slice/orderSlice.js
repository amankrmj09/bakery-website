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

export const fetchActiveUserOrders = createAsyncThunk(
  'order/fetchActiveUserOrders',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await orderApi.getActiveUserOrders(userId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch active user orders'
      );
    }
  }
);

export const cancelUserOrder = createAsyncThunk(
  'order/cancelUserOrder',
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      const response = await orderApi.cancelOrder(orderId, reason);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data || 'Failed to cancel order'
      );
    }
  }
);

const initialState = {
  orders: [],
  activeOrders: [],
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
    markOrderAsPaid: (state, action) => {
      const orderId = action.payload;
      const orderIdx = state.orders.findIndex(o => o.id === orderId);
      if (orderIdx !== -1) {
        state.orders[orderIdx].paymentStatus = 'COMPLETED';
      }
      const activeIdx = state.activeOrders.findIndex(o => o.id === orderId);
      if (activeIdx !== -1) {
        state.activeOrders[activeIdx].paymentStatus = 'COMPLETED';
      }
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
      })
      .addCase(fetchActiveUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.activeOrders = action.payload?.content || action.payload || [];
      })
      .addCase(fetchActiveUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelUserOrder.fulfilled, (state, action) => {
        const cancelledOrder = action.payload;
        if (cancelledOrder && cancelledOrder.id) {
          const idx = state.orders.findIndex(o => o.id === cancelledOrder.id);
          if (idx !== -1) {
            state.orders[idx] = cancelledOrder;
          }
          const activeIdx = state.activeOrders.findIndex(o => o.id === cancelledOrder.id);
          if (activeIdx !== -1) {
            state.activeOrders.splice(activeIdx, 1);
          }
        }
      });
  },
});

export const { clearOrderError, markOrderAsPaid } = orderSlice.actions;

export default orderSlice.reducer;
