import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

// GET all customers
export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/customers");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load customers"
      );
    }
  }
);

// POST — add customer
export const addCustomer = createAsyncThunk(
  "customers/addCustomer",
  async (formData, thunkAPI) => {
    try {
      const res = await API.post("/customers", formData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add customer"
      );
    }
  }
);

// PUT — edit customer
export const updateCustomer = createAsyncThunk(
  "customers/updateCustomer",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await API.put(`/customers/${id}`, formData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update customer"
      );
    }
  }
);

// DELETE
export const deleteCustomer = createAsyncThunk(
  "customers/deleteCustomer",
  async (id, thunkAPI) => {
    try {
      await API.delete(`/customers/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete customer"
      );
    }
  }
);

const customerSlice = createSlice({
  name: "customers",

  initialState: {
    customers: [],
    loading:   false,
    error:     null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchCustomers.pending,   (state)         => { state.loading = true;  state.error = null; })
      .addCase(fetchCustomers.fulfilled, (state, action) => { state.loading = false; state.customers = Array.isArray(action.payload) ? action.payload : []; })
      .addCase(fetchCustomers.rejected,  (state, action) => { state.loading = false; state.error = action.payload; state.customers = []; })

      // ADD
      .addCase(addCustomer.pending,      (state)         => { state.loading = true;  state.error = null; })
      .addCase(addCustomer.fulfilled,    (state, action) => { state.loading = false; state.customers.unshift(action.payload); })
      .addCase(addCustomer.rejected,     (state, action) => { state.loading = false; state.error = action.payload; })

      // UPDATE
      .addCase(updateCustomer.pending,   (state)         => { state.loading = true;  state.error = null; })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.customers.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) state.customers[index] = action.payload;
      })
      .addCase(updateCustomer.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      // DELETE
      .addCase(deleteCustomer.pending,   (state)         => { state.error = null; })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteCustomer.rejected,  (state, action) => { state.error = action.payload; });
  },
});

export default customerSlice.reducer;