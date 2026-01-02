import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  listApplications,
  fetchApplicationsByUrl,
  acceptApplication,
  rejectApplication,
} from "@/services/jobsService";

// Normalize anything → { results, count, next, previous }
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

export const fetchApplications = createAsyncThunk(
  "applications/fetch",
  async (arg = {}, { rejectWithValue }) => {
    try {
      let response;
      if (arg.url) {
        response = await fetchApplicationsByUrl(arg.url);
      } else {
        response = await listApplications(arg); // cleaner-scoped on backend
      }
      const { data } = response || {};
      const normalized = normalizeList(data);
      console.debug("[applications/fetch] OK", { arg, results: normalized.results.length });
      return { data: normalized, params: arg };
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to load applications";
      console.debug("[applications/fetch] ERR", { arg, msg });
      return rejectWithValue(msg);
    }
  }
);

export const acceptApplicationThunk = createAsyncThunk(
  "applications/accept",
  async (applicationId, { rejectWithValue }) => {
    try {
      const res = await acceptApplication(applicationId);
      console.debug("[applications/accept] OK", { applicationId });
      return { applicationId, res };
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to accept";
      console.debug("[applications/accept] ERR", { applicationId, msg });
      return rejectWithValue(msg);
    }
  }
);

export const rejectApplicationThunk = createAsyncThunk(
  "applications/reject",
  async ({ applicationId, reason }, { rejectWithValue }) => {
    try {
      const res = await rejectApplication(applicationId, reason);
      console.debug("[applications/reject] OK", { applicationId, reason });
      return { applicationId, res };
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to reject";
      console.debug("[applications/reject] ERR", { applicationId, msg });
      return rejectWithValue(msg);
    }
  }
);

const applicationsSlice = createSlice({
  name: "applications",
  initialState: {
    list: { results: [], count: 0, next: null, previous: null },
    params: {},
    loading: false,
    error: null,
    acting: false,
    errorAct: null,
    hasLoadedOnce: false, // ✅ guard
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchApplications.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchApplications.fulfilled, (s, a) => {
      s.loading = false;
      s.list = a.payload.data; // normalized
      s.params = a.payload.params;
      s.hasLoadedOnce = true;  // ✅ mark fetched
    });
    b.addCase(fetchApplications.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload || a.error?.message || "Failed to load applications";
      s.hasLoadedOnce = true;  // avoid loops even on error
    });

    b.addCase(acceptApplicationThunk.pending, (s) => { s.acting = true; s.errorAct = null; });
    b.addCase(acceptApplicationThunk.fulfilled, (s, a) => {
      s.acting = false;
      const id = a.payload.applicationId;
      const idx = s.list.results.findIndex((x) => (x.application_id || x.id) === id);
      if (idx >= 0) s.list.results[idx].status = "a";
    });
    b.addCase(acceptApplicationThunk.rejected, (s, a) => {
      s.acting = false; s.errorAct = a.payload || a.error?.message || "Failed to accept";
    });

    b.addCase(rejectApplicationThunk.pending, (s) => { s.acting = true; s.errorAct = null; });
    b.addCase(rejectApplicationThunk.fulfilled, (s, a) => {
      s.acting = false;
      const id = a.payload.applicationId;
      const idx = s.list.results.findIndex((x) => (x.application_id || x.id) === id);
      if (idx >= 0) s.list.results[idx].status = "r";
    });
    b.addCase(rejectApplicationThunk.rejected, (s, a) => {
      s.acting = false; s.errorAct = a.payload || a.error?.message || "Failed to reject";
    });
  },
});

export default applicationsSlice.reducer;
