// @/store/slices/applicantsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { listApplicants, acceptApplication, rejectApplication } from "@/services/jobsService";

export const fetchApplicants = createAsyncThunk(
  "applicants/fetch",
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await listApplicants(jobId);
      return data;
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to load applicants";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const acceptApplicant = createAsyncThunk(
  "applicants/accept",
  async ({ applicationId }, { rejectWithValue }) => {
    try {
      await acceptApplication(applicationId);
      toast.success("Application accepted");
      return { applicationId };
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to accept";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const rejectApplicantThunk = createAsyncThunk(
  "applicants/reject",
  async ({ applicationId, reason = "" }, { rejectWithValue }) => {
    try {
      await rejectApplication(applicationId, reason);
      toast.success("Application rejected");
      return { applicationId, reason };
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to reject";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

const applicantsSlice = createSlice({
  name: "applicants",
  initialState: {
    items: [],
    loading: false,
    acting: {},
    error: null,
  },
  reducers: {
    resetApplicants: (s) => { s.items = []; s.loading = false; s.error = null; s.acting = {}; },
  },
  extraReducers: (b) => {
    b.addCase(fetchApplicants.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(fetchApplicants.fulfilled, (s, a) => { s.loading = false; s.items = a.payload || []; });
    b.addCase(fetchApplicants.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error?.message; });

    b.addCase(acceptApplicant.pending, (s, a) => { s.acting[a.meta.arg.applicationId] = true; });
    b.addCase(acceptApplicant.fulfilled, (s, a) => {
      delete s.acting[a.payload.applicationId];
      const idx = s.items.findIndex(i => i.application_id === a.payload.applicationId);
      if (idx >= 0) s.items[idx].status = "a";
    });
    b.addCase(acceptApplicant.rejected, (s, a) => { delete s.acting[a.meta.arg.applicationId]; });

    b.addCase(rejectApplicantThunk.pending, (s, a) => { s.acting[a.meta.arg.applicationId] = true; });
    b.addCase(rejectApplicantThunk.fulfilled, (s, a) => {
      delete s.acting[a.payload.applicationId];
      const idx = s.items.findIndex(i => i.application_id === a.payload.applicationId);
      if (idx >= 0) {
        s.items[idx].status = "r";
        s.items[idx].rejection_reason = a.payload.reason;
      }
    });
    b.addCase(rejectApplicantThunk.rejected, (s, a) => { delete s.acting[a.meta.arg.applicationId]; });
  },
});

export const { resetApplicants } = applicantsSlice.actions;
export const selectApplicants = (state) => state.applicants;
export default applicantsSlice.reducer;
