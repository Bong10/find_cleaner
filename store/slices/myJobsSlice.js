// @/store/slices/myJobsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  listMyJobs,
  listMyJobMetrics,
  archiveJob,
  getJob,
  updateJob,
  listApplicants,
  acceptApplication,
  rejectApplication,
} from "@/services/jobsService";

// helper: YYYY-MM-DD for "date__gte"
const dateGteMonthsAgo = (months = 6) => {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// --- list (mine) ---
export const fetchMyJobs = createAsyncThunk(
  "myJobs/fetchMyJobs",
  async ({ months = 6 } = {}, { rejectWithValue }) => {
    try {
      const params = { "date__gte": dateGteMonthsAgo(months) };
      const { data } = await listMyJobs(params);
      // supports paginated or plain list
      const jobs = Array.isArray(data?.results) ? data.results : data;
      return { jobs, months };
    } catch (err) {
      const detail = err?.response?.data?.detail || err?.message || "Failed to load jobs";
      return rejectWithValue(detail);
    }
  }
);

// --- metrics ---
export const fetchMyJobMetrics = createAsyncThunk(
  "myJobs/fetchMyJobMetrics",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await listMyJobMetrics();
      const list = Array.isArray(data?.results) ? data.results : data;
      const map = {};
      (list || []).forEach((m) => { map[m.job_id] = m; });
      return map;
    } catch (err) {
      const detail = err?.response?.data?.detail || err?.message || "Failed to load metrics";
      return rejectWithValue(detail);
    }
  }
);

// --- archive (soft delete) ---
export const archiveMyJob = createAsyncThunk(
  "myJobs/archiveMyJob",
  async (jobId, { rejectWithValue }) => {
    try {
      await archiveJob(jobId);
      return jobId;
    } catch (err) {
      const detail = err?.response?.data?.detail || err?.message || "Failed to archive job";
      return rejectWithValue(detail);
    }
  }
);

// ---------- NEW: detail ----------
export const loadJobDetail = createAsyncThunk(
  "myJobs/loadJobDetail",
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await getJob(jobId);
      return data;
    } catch (err) {
      const msg = err?.response?.data?.detail || "Failed to load job";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// ---------- NEW: update/edit ----------
export const saveJobEdits = createAsyncThunk(
  "myJobs/saveJobEdits",
  async ({ jobId, payload }, { rejectWithValue }) => {
    try {
      const { data } = await updateJob(jobId, payload);
      toast.success("Job updated");
      return data;
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === "object") {
        // send field errors to toaster
        Object.entries(data).forEach(([field, msgs]) => {
          const msg = Array.isArray(msgs) ? msgs[0] : String(msgs);
          toast.error(`${field}: ${msg}`);
        });
        return rejectWithValue(data);
      }
      const msg = err?.message || "Failed to update job";
      toast.error(msg);
      return rejectWithValue({ detail: msg });
    }
  }
);

// ---------- NEW: applicants ----------
export const loadApplicants = createAsyncThunk(
  "myJobs/loadApplicants",
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await listApplicants(jobId);
      const list = Array.isArray(data?.results) ? data.results : data;
      return { jobId, applicants: list || [] };
    } catch (err) {
      const msg = err?.response?.data?.detail || "Failed to load applicants";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const acceptApplicant = createAsyncThunk(
  "myJobs/acceptApplicant",
  async ({ jobId, applicationId }, { dispatch, rejectWithValue }) => {
    try {
      await acceptApplication(applicationId);
      toast.success("Application accepted");
      await dispatch(loadApplicants(jobId));     // refresh applicants
      await dispatch(fetchMyJobs({}));          // refresh list/status
      await dispatch(fetchMyJobMetrics());      // refresh metrics chips if you show them
      return true;
    } catch (err) {
      const msg = err?.response?.data?.detail || "Failed to accept";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const rejectApplicant = createAsyncThunk(
  "myJobs/rejectApplicant",
  async ({ jobId, applicationId, reason = "" }, { dispatch, rejectWithValue }) => {
    try {
      await rejectApplication(applicationId, reason);
      toast.success("Application rejected");
      await dispatch(loadApplicants(jobId));
      return true;
    } catch (err) {
      const msg = err?.response?.data?.detail || "Failed to reject";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

const initialState = {
  items: [],
  metricsById: {},
  status: "idle",
  error: null,
  filterMonths: 6,
  archivingIds: {},

  // detail/edit
  detail: null,
  detailStatus: "idle",
  saving: false,

  // applicants
  applicantsByJob: {},   // { [jobId]: [] }
  applicantsStatus: "idle",
};

const myJobsSlice = createSlice({
  name: "myJobs",
  initialState,
  reducers: {
    setFilterMonths(state, action) {
      state.filterMonths = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // list mine
      .addCase(fetchMyJobs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.jobs || [];
        state.filterMonths = action.payload.months;
      })
      .addCase(fetchMyJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error?.message || "Failed to load jobs";
        toast.error(state.error);
      })

      // metrics
      .addCase(fetchMyJobMetrics.fulfilled, (state, action) => {
        state.metricsById = action.payload || {};
      })
      .addCase(fetchMyJobMetrics.rejected, (state, action) => {
        const msg = action.payload || action.error?.message || "Failed to load metrics";
        toast.error(msg);
      })

      // archive
      .addCase(archiveMyJob.pending, (state, action) => {
        state.archivingIds[action.meta.arg] = true;
      })
      .addCase(archiveMyJob.fulfilled, (state, action) => {
        const id = action.payload;
        delete state.archivingIds[id];
        state.items = state.items.filter((j) => j.job_id !== id);
        toast.success("Job archived");
      })
      .addCase(archiveMyJob.rejected, (state, action) => {
        const id = action.meta.arg;
        delete state.archivingIds[id];
        const msg = action.payload || action.error?.message || "Failed to archive job";
        toast.error(msg);
      })

      // detail
      .addCase(loadJobDetail.pending, (state) => {
        state.detailStatus = "loading";
        state.detail = null;
      })
      .addCase(loadJobDetail.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.detail = action.payload;
      })
      .addCase(loadJobDetail.rejected, (state) => {
        state.detailStatus = "failed";
        state.detail = null;
      })

      // save edits
      .addCase(saveJobEdits.pending, (state) => {
        state.saving = true;
      })
      .addCase(saveJobEdits.fulfilled, (state, action) => {
        state.saving = false;
        state.detail = action.payload; // keep the edited job hydrated
      })
      .addCase(saveJobEdits.rejected, (state) => {
        state.saving = false;
      })

      // applicants
      .addCase(loadApplicants.pending, (state) => {
        state.applicantsStatus = "loading";
      })
      .addCase(loadApplicants.fulfilled, (state, action) => {
        state.applicantsStatus = "succeeded";
        state.applicantsByJob[action.payload.jobId] = action.payload.applicants || [];
      })
      .addCase(loadApplicants.rejected, (state) => {
        state.applicantsStatus = "failed";
      });
  },
});

export const { setFilterMonths } = myJobsSlice.actions;
export const selectMyJobs = (state) => state.myJobs;
export default myJobsSlice.reducer;
