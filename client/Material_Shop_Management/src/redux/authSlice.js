import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

// REGISTER USER API
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const response = await API.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// LOGIN USER
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, thunkAPI) => {
    try {
      const response = await API.post("/auth/login", userData);

      // store token in localStorage
      localStorage.setItem("user", JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);


const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: null,
    loading: false,
    error: null,
    success: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // REGISTER PENDING
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // REGISTER SUCCESS
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
      })

      // REGISTER ERROR
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

            // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;