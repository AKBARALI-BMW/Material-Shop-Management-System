import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

// GET all orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/orders");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load orders"
      );
    }
  }
);

// POST — create order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, thunkAPI) => {
    try {
      const res = await API.post("/orders", orderData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create order"
      );
    }
  }
);


 export const updatePayment = createAsyncThunk(
  "orders/updatePayment",
  async ({ id, amount, note }, thunkAPI) => {
    try {
      const res = await API.patch(`/orders/${id}/pay`, { amount, note });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update payment"
      );
    }
  }
);

// DELETE
export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (id, thunkAPI) => {
    try {
      await API.delete(`/orders/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete order"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",

  initialState: {
    orders:  [],
    loading: false,
    error:   null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchOrders.pending,    (state)         => { state.loading = true;  state.error = null; })
      .addCase(fetchOrders.fulfilled,  (state, action) => { state.loading = false; state.orders = Array.isArray(action.payload) ? action.payload : []; })
      .addCase(fetchOrders.rejected,   (state, action) => { state.loading = false; state.error = action.payload; state.orders = []; })

      // CREATE
      .addCase(createOrder.pending,    (state)         => { state.loading = true;  state.error = null; })
      .addCase(createOrder.fulfilled,  (state, action) => { state.loading = false; state.orders.unshift(action.payload); })
      .addCase(createOrder.rejected,   (state, action) => { state.loading = false; state.error = action.payload; })

      // UPDATE PAYMENT
      .addCase(updatePayment.pending,  (state)         => { state.error = null; })
      .addCase(updatePayment.fulfilled,(state, action) => {
        const index = state.orders.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) state.orders[index] = action.payload;
      })
      .addCase(updatePayment.rejected, (state, action) => { state.error = action.payload; })

      // DELETE
      .addCase(deleteOrder.pending,    (state)         => { state.error = null; })
      .addCase(deleteOrder.fulfilled,  (state, action) => {
        state.orders = state.orders.filter((o) => o._id !== action.payload);
      })
      .addCase(deleteOrder.rejected,   (state, action) => { state.error = action.payload; });
  },
});

export default orderSlice.reducer;

