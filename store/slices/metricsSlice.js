import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getJobMetrics } from "@/services/jobsService";

export const fetchJobMetrics = createAsyncThunk(
  "metrics/fetchJobMetrics",
  async ({ page } = {}) => {
    const data = await getJobMetrics({ page });
    return data; // paginated
  }
);

const metricsSlice = createSlice({
  name: "metrics",
  initialState: {
    list: { results: [], count: 0, next: null, previous: null },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchJobMetrics.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(fetchJobMetrics.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; });
    b.addCase(fetchJobMetrics.rejected, (s, a) => { s.loading = false; s.error = a.error?.message || "Failed to load metrics"; });
  },
});

export default metricsSlice.reducer;
