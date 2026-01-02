// store/slices/publicJobsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { listJobs, fetchJobsByUrl } from "@/services/jobsService";

const normalizeList = (data) => {
  if (Array.isArray(data)) return { results: data, count: data.length, next: null, previous: null };
  if (Array.isArray(data?.results)) {
    return {
      results: data.results,
      count: Number(data.count || data.results.length || 0),
      next: data.next || null,
      previous: data.previous || null,
    };
  }
  return { results: [], count: 0, next: null, previous: null };
};

export const fetchPublicJobs = createAsyncThunk(
  "publicJobs/fetch",
  async (arg = {}, { rejectWithValue }) => {
    try {
      const res = arg.url ? await fetchJobsByUrl(arg.url) : await listJobs(arg);
      return normalizeList(res?.data);
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to load jobs";
      return rejectWithValue(msg);
    }
  }
);

const slice = createSlice({
  name: "publicJobs",
  initialState: {
    list: { results: [], count: 0, next: null, previous: null },
    loading: false,
    error: null,
    lastKey: null, // to avoid duplicate fetch loops
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchPublicJobs.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(fetchPublicJobs.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; });
    b.addCase(fetchPublicJobs.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error?.message; });
  },
});

export default slice.reducer;
