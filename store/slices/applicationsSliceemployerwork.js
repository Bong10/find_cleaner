import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  listApplications,
  fetchApplicationsByUrl,
  acceptApplication,
  rejectApplication,
} from "@/services/jobsService";

export const fetchApplications = createAsyncThunk(
  "applications/fetch",
  async (params = {}) => {
    const data = await listApplications(params); // supports ?job=<id> etc.
    return { data, params };
  }
);

export const acceptApplicationThunk = createAsyncThunk(
  "applications/accept",
  async (applicationId) => {
    const res = await acceptApplication(applicationId);
    return { applicationId, res };
  }
);

export const rejectApplicationThunk = createAsyncThunk(
  "applications/reject",
  async ({ applicationId, reason }) => {
    const res = await rejectApplication(applicationId, reason);
    return { applicationId, res };
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
  },
  reducers: {},
  extraReducers: (b) => {
    // list
    b.addCase(fetchApplications.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(fetchApplications.fulfilled, (s, a) => {
      s.loading = false; s.list = a.payload.data; s.params = a.payload.params;
    });
    b.addCase(fetchApplications.rejected, (s, a) => { s.loading = false; s.error = a.error?.message || "Failed to load applications"; });

    // accept
    b.addCase(acceptApplicationThunk.pending, (s) => { s.acting = true; s.errorAct = null; });
    b.addCase(acceptApplicationThunk.fulfilled, (s, a) => {
      s.acting = false;
      const id = a.payload.applicationId;
      const idx = s.list.results.findIndex(x => x.application_id === id);
      if (idx >= 0) s.list.results[idx].status = "a";
    });
    b.addCase(acceptApplicationThunk.rejected, (s, a) => { s.acting = false; s.errorAct = a.error?.message || "Failed to accept"; });

    // reject
    b.addCase(rejectApplicationThunk.pending, (s) => { s.acting = true; s.errorAct = null; });
    b.addCase(rejectApplicationThunk.fulfilled, (s, a) => {
      s.acting = false;
      const id = a.payload.applicationId;
      const idx = s.list.results.findIndex(x => x.application_id === id);
      if (idx >= 0) s.list.results[idx].status = "r";
    });
    b.addCase(rejectApplicationThunk.rejected, (s, a) => { s.acting = false; s.errorAct = a.error?.message || "Failed to reject"; });
  },
});

export default applicationsSlice.reducer;
