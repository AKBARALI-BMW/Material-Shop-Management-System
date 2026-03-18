import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/dashboard");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load dashboard"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState: {
    data:    null,
    loading: false,
    error:   null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending,   (state)         => { state.loading = true;  state.error = null; })
      .addCase(fetchDashboard.fulfilled, (state, action) => { state.loading = false; state.data  = action.payload; })
      .addCase(fetchDashboard.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default dashboardSlice.reducer;
