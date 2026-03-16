import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

// GET all inventory
export const fetchInventory = createAsyncThunk(
  "inventory/fetchInventory",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/inventory");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load inventory"
      );
    }
  }
);

// PATCH — set stock
export const setStock = createAsyncThunk(
  "inventory/setStock",
  async ({ id, stock }, thunkAPI) => {
    try {
      const res = await API.patch(`/inventory/${id}/set`, { stock });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to set stock"
      );
    }
  }
);

// PATCH — add stock
export const addStock = createAsyncThunk(
  "inventory/addStock",
  async ({ id, stock }, thunkAPI) => {
    try {
      const res = await API.patch(`/inventory/${id}/add`, { stock });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add stock"
      );
    }
  }
);

const inventorySlice = createSlice({
  name: "inventory",

  initialState: {
    inventory: [],
    loading:   false,
    error:     null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchInventory.pending,   (state)         => { state.loading = true;  state.error = null; })
      .addCase(fetchInventory.fulfilled, (state, action) => { state.loading = false; state.inventory = Array.isArray(action.payload) ? action.payload : []; })
      .addCase(fetchInventory.rejected,  (state, action) => { state.loading = false; state.error = action.payload; state.inventory = []; })

      // SET STOCK
      .addCase(setStock.pending,         (state)         => { state.error = null; })
      .addCase(setStock.fulfilled,       (state, action) => {
        const index = state.inventory.findIndex((i) => i._id === action.payload._id);
        if (index !== -1) state.inventory[index] = action.payload;
      })
      .addCase(setStock.rejected,        (state, action) => { state.error = action.payload; })

      // ADD STOCK
      .addCase(addStock.pending,         (state)         => { state.error = null; })
      .addCase(addStock.fulfilled,       (state, action) => {
        const index = state.inventory.findIndex((i) => i._id === action.payload._id);
        if (index !== -1) state.inventory[index] = action.payload;
      })
      .addCase(addStock.rejected,        (state, action) => { state.error = action.payload; });
  },
});

export default inventorySlice.reducer;