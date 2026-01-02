// store/slices/servicesSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchServices } from "@/services/jobsService";
import { toast } from "react-toastify";

export const loadServices = createAsyncThunk(
  "services/load",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchServices();
    } catch (err) {
      const msg =
        err?.response?.data?.detail || err?.message || "Failed to load services";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

const servicesSlice = createSlice({
  name: "services",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadServices.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(loadServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load services";
      });
  },
});

export default servicesSlice.reducer;
