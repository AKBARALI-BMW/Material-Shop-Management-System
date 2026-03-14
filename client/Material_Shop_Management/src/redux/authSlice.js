import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";


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


 export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, thunkAPI) => {
    try {
      const response = await API.post("/auth/login", userData);
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
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    loading: false,
    error: null,
    success: false,
  },
  
  reducers: {
    // ✅ logout action added here
    logout(state) {
      state.user = null;
      state.error = null;
      state.success = false;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending,    (state)          => { state.loading = true;  state.error = null; })
      .addCase(registerUser.fulfilled,  (state, action)  => { state.loading = false; state.success = true; state.user = action.payload; })
      .addCase(registerUser.rejected,   (state, action)  => { state.loading = false; state.error = action.payload; })
      .addCase(loginUser.pending,       (state)          => { state.loading = true;  state.error = null; })
      .addCase(loginUser.fulfilled,     (state, action)  => { state.loading = false; state.user = action.payload; })
      .addCase(loginUser.rejected,      (state, action)  => { state.loading = false; state.error = action.payload; });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;