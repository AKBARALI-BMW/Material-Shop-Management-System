import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

// GET settings — load from backend
export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/settings");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load settings"
      );
    }
  }
);

// POST settings — save to backend
export const saveSettings = createAsyncThunk(
  "settings/saveSettings",
  async (formData, thunkAPI) => {
    try {
      const res = await API.post("/settings", formData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to save settings"
      );
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",

  initialState: {
    data:    null,
    loading: false,
    saving:  false,
    error:   null,
    saved:   false,
  },

  reducers: {
    // reset saved flag manually
    resetSaved(state) {
      state.saved = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data    = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // SAVE
      .addCase(saveSettings.pending, (state) => {
        state.saving = true;
        state.saved  = false;
        state.error  = null;
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.saving = false;
        state.saved  = true;
        state.data   = action.payload;
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.saving = false;
        state.error  = action.payload;
      });
  },
});

export const { resetSaved } = settingsSlice.actions;
export default settingsSlice.reducer;