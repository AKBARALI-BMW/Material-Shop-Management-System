import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

// GET sales report
export const fetchSalesReport = createAsyncThunk(
  "reports/fetchSalesReport",
  async (period = "month", thunkAPI) => {
    try {
      const res = await API.get(`/reports/sales?period=${period}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load sales report"
      );
    }
  }
);

// GET product sales report
export const fetchProductSalesReport = createAsyncThunk(
  "reports/fetchProductSalesReport",
  async (period = "month", thunkAPI) => {
    try {
      const res = await API.get(`/reports/products?period=${period}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load product report"
      );
    }
  }
);

// GET all customers report
export const fetchCustomerReport = createAsyncThunk(
  "reports/fetchCustomerReport",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/reports/customers");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load customer report"
      );
    }
  }
);

// GET single customer orders
export const fetchCustomerOrders = createAsyncThunk(
  "reports/fetchCustomerOrders",
  async (customerId, thunkAPI) => {
    try {
      const res = await API.get(`/reports/customers/${customerId}/orders`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load customer orders"
      );
    }
  }
);

// GET low stock report
export const fetchLowStockReport = createAsyncThunk(
  "reports/fetchLowStockReport",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/reports/low-stock");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load low stock report"
      );
    }
  }
);

// GET invoice
export const fetchInvoice = createAsyncThunk(
  "reports/fetchInvoice",
  async (orderId, thunkAPI) => {
    try {
      const res = await API.get(`/reports/invoice/${orderId}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load invoice"
      );
    }
  }
);

// GET receipt
export const fetchReceipt = createAsyncThunk(
  "reports/fetchReceipt",
  async ({ orderId, paymentIndex }, thunkAPI) => {
    try {
      const res = await API.get(`/reports/receipt/${orderId}/${paymentIndex}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load receipt"
      );
    }
  }
);

const reportSlice = createSlice({
  name: "reports",

  initialState: {
    sales: {
      data:    null,
      loading: false,
      error:   null,
    },
    productSales: {
      data:    null,
      loading: false,
      error:   null,
    },
    customerReport: {
      data:    [],
      loading: false,
      error:   null,
    },
    customerOrders: {
      data:    null,
      loading: false,
      error:   null,
    },
    lowStock: {
      data:    null,
      loading: false,
      error:   null,
    },
    invoice: {
      data:    null,
      loading: false,
      error:   null,
    },
    receipt: {
      data:    null,
      loading: false,
      error:   null,
    },
  },

  reducers: {
    clearCustomerOrders(state) {
      state.customerOrders.data = null;
    },
    clearInvoice(state) {
      state.invoice.data = null;
    },
    clearReceipt(state) {
      state.receipt.data = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // SALES
      .addCase(fetchSalesReport.pending,   (state) => { state.sales.loading = true;  state.sales.error = null; })
      .addCase(fetchSalesReport.fulfilled, (state, action) => { state.sales.loading = false; state.sales.data = action.payload; })
      .addCase(fetchSalesReport.rejected,  (state, action) => { state.sales.loading = false; state.sales.error = action.payload; })

      // PRODUCT SALES
      .addCase(fetchProductSalesReport.pending,   (state) => { state.productSales.loading = true;  state.productSales.error = null; })
      .addCase(fetchProductSalesReport.fulfilled, (state, action) => { state.productSales.loading = false; state.productSales.data = action.payload; })
      .addCase(fetchProductSalesReport.rejected,  (state, action) => { state.productSales.loading = false; state.productSales.error = action.payload; })

      // CUSTOMER REPORT
      .addCase(fetchCustomerReport.pending,   (state) => { state.customerReport.loading = true;  state.customerReport.error = null; })
      .addCase(fetchCustomerReport.fulfilled, (state, action) => { state.customerReport.loading = false; state.customerReport.data = Array.isArray(action.payload) ? action.payload : []; })
      .addCase(fetchCustomerReport.rejected,  (state, action) => { state.customerReport.loading = false; state.customerReport.error = action.payload; })

      // CUSTOMER ORDERS
      .addCase(fetchCustomerOrders.pending,   (state) => { state.customerOrders.loading = true;  state.customerOrders.error = null; })
      .addCase(fetchCustomerOrders.fulfilled, (state, action) => { state.customerOrders.loading = false; state.customerOrders.data = action.payload; })
      .addCase(fetchCustomerOrders.rejected,  (state, action) => { state.customerOrders.loading = false; state.customerOrders.error = action.payload; })

      // LOW STOCK
      .addCase(fetchLowStockReport.pending,   (state) => { state.lowStock.loading = true;  state.lowStock.error = null; })
      .addCase(fetchLowStockReport.fulfilled, (state, action) => { state.lowStock.loading = false; state.lowStock.data = action.payload; })
      .addCase(fetchLowStockReport.rejected,  (state, action) => { state.lowStock.loading = false; state.lowStock.error = action.payload; })

      // INVOICE
      .addCase(fetchInvoice.pending,   (state) => { state.invoice.loading = true;  state.invoice.error = null; })
      .addCase(fetchInvoice.fulfilled, (state, action) => { state.invoice.loading = false; state.invoice.data = action.payload; })
      .addCase(fetchInvoice.rejected,  (state, action) => { state.invoice.loading = false; state.invoice.error = action.payload; })

      // RECEIPT
      .addCase(fetchReceipt.pending,   (state) => { state.receipt.loading = true;  state.receipt.error = null; })
      .addCase(fetchReceipt.fulfilled, (state, action) => { state.receipt.loading = false; state.receipt.data = action.payload; })
      .addCase(fetchReceipt.rejected,  (state, action) => { state.receipt.loading = false; state.receipt.error = action.payload; });
  },
});

export const { clearCustomerOrders, clearInvoice, clearReceipt } = reportSlice.actions;
export default reportSlice.reducer;
