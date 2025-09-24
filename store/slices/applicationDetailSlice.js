// @/store/slices/applicationDetailSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApplication } from "@/services/jobsService";

export const loadApplication = createAsyncThunk(
  "applicationDetail/load",
  async (applicationId, { rejectWithValue }) => {
    try {
      const { data } = await getApplication(applicationId);
      return data;
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to load application";
      return rejectWithValue(msg);
    }
  }
);

const slice = createSlice({
  name: "applicationDetail",
  initialState: { item: null, status: "idle", error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(loadApplication.pending, (s) => { s.status = "loading"; s.error = null; s.item = null; });
    b.addCase(loadApplication.fulfilled, (s, a) => { s.status = "succeeded"; s.item = a.payload || null; });
    b.addCase(loadApplication.rejected, (s, a) => { s.status = "failed"; s.error = a.payload || a.error?.message; });
  },
});

export default slice.reducer;
