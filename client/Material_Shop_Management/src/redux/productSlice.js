import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

// GET all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/products");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load products"
      );
    }
  }
);

// POST — add product
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (formData, thunkAPI) => {
    try {
      const res = await API.post("/products", formData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add product"
      );
    }
  }
);

// PUT — edit product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await API.put(`/products/${id}`, formData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

// PATCH — update stock only
export const updateStock = createAsyncThunk(
  "products/updateStock",
  async ({ id, stock }, thunkAPI) => {
    try {
      const res = await API.patch(`/products/${id}/stock`, { stock });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update stock"
      );
    }
  }
);

// DELETE
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, thunkAPI) => {
    try {
      await API.delete(`/products/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",

  initialState: {
    products: [],   // ← always empty array, never null
    loading:  false,
    error:    null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchProducts.pending,   (state)         => { state.loading = true;  state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.loading = false; state.products = Array.isArray(action.payload) ? action.payload : []; })
      .addCase(fetchProducts.rejected,  (state, action) => { state.loading = false; state.error = action.payload; state.products = []; })

      // ADD
      .addCase(addProduct.pending,      (state)         => { state.loading = true;  state.error = null; })
      .addCase(addProduct.fulfilled,    (state, action) => { state.loading = false; state.products.unshift(action.payload); })
      .addCase(addProduct.rejected,     (state, action) => { state.loading = false; state.error = action.payload; })

      // UPDATE
      .addCase(updateProduct.pending,   (state)         => { state.loading = true;  state.error = null; })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(updateProduct.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      // UPDATE STOCK
      .addCase(updateStock.pending,     (state)         => { state.error = null; })
      .addCase(updateStock.fulfilled,   (state, action) => {
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(updateStock.rejected,    (state, action) => { state.error = action.payload; })

      // DELETE
      .addCase(deleteProduct.pending,   (state)         => { state.error = null; })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected,  (state, action) => { state.error = action.payload; });
  },
});

export default productSlice.reducer;