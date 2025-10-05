// store/slices/jobsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createJob, getJob } from "@/services/jobsService";
import { toast } from "react-toastify";

/**
 * Your original job-post form state + async submit is kept intact.
 * Added `browse` key holding the public-job-list UI metadata and toggles
 * (migrated from the previous jobSlice).
 */

const initialState = {
  // === existing form flow (unchanged) ===
  form: {
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    hourly_rate: "",
    hours_required: 1,
    services: [], // array of IDs
  },
  submitting: false,
  error: null,
  created: null,

  // === NEW: integrated public-list UI data/toggles (from old jobSlice) ===
  browse: {
    latestJob: ["full-time"],
    // category: [
    //   { id: 1, name: "Residential", value: "residential" },
    //   { id: 2, name: "Commercial",  value: "commercial"  },
    //   { id: 3, name: "Industrial",  value: "industrial"  },
    //   { id: 4, name: "Apartments",  value: "apartments"  },
    // ],
    // jobTypeList: [
    //   { id: 1, name: "Freelancer", value: "freelancer", isChecked: false },
    //   { id: 2, name: "Full Time",  value: "full-time",  isChecked: false },
    //   { id: 3, name: "Part Time",  value: "part-time",  isChecked: false },
    //   { id: 4, name: "Temporary",  value: "temporary",  isChecked: false },
    // ],
    datePost: [
      { id: 1, name: "All",        value: "all",          isChecked: true },
      { id: 2, name: "Last Hour",  value: "last-hour",    isChecked: false },
      { id: 3, name: "Last 24 Hour", value: "last-24-hour", isChecked: false },
      { id: 4, name: "Last 7 Days",  value: "last-7-days",  isChecked: false },
      { id: 5, name: "Last 14 Days", value: "last-14-days", isChecked: false },
      { id: 6, name: "Last 30 Days", value: "last-30-days", isChecked: false },
    ],
    // experienceLavel: [
    //   { id: 1, name: "Fresh", value: "fresh",  isChecked: false },
    //   { id: 2, name: "1 Year", value: "1-year", isChecked: false },
    //   { id: 3, name: "2 Year", value: "2-year", isChecked: false },
    //   { id: 4, name: "3 Year", value: "3-year", isChecked: false },
    //   { id: 5, name: "4 Year", value: "4-year", isChecked: false },
    // ],
    // tags: [
    //   { id: 1, name: "App",           value: "app" },
    //   { id: 2, name: "Administrative",value: "administrative" },
    //   { id: 3, name: "Android",       value: "android" },
    //   { id: 4, name: "Wordpress",     value: "wordpress" },
    //   { id: 5, name: "Design",        value: "design" },
    //   { id: 6, name: "React",         value: "react" },
    // ],
  },

  // NEW: Store for fetched jobs
  fetchedJobs: {},
  fetchingJobs: {},
  fetchErrors: {},
};

// ===== existing async (unchanged) =====
export const submitJob = createAsyncThunk(
  "jobs/submit",
  async (_, { getState, rejectWithValue }) => {
    const { jobs } = getState();
    const f = jobs.form;

    // client-side guardrails
    if (!f.title?.trim()) return rejectWithValue({ title: ["Title is required."] });
    if (!f.description?.trim()) return rejectWithValue({ description: ["Description is required."] });
    if (!f.location?.trim()) return rejectWithValue({ location: ["Location is required."] });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f.date)) return rejectWithValue({ date: ["Date must be YYYY-MM-DD."] });
    if (!/^\d{2}:\d{2}$/.test(f.time)) return rejectWithValue({ time: ["Time must be HH:MM."] });
    if (!Array.isArray(f.services) || f.services.length === 0)
      return rejectWithValue({ services: ["Select at least one service."] });

    const payload = {
      title: f.title.trim(),
      description: f.description.trim(),
      location: f.location.trim(),
      date: f.date,
      time: f.time,
      hourly_rate: f.hourly_rate === "" ? 0 : Number(f.hourly_rate),
      hours_required: Number(f.hours_required) || 1,
      services: f.services,
    };

    try {
      const data = await createJob(payload);
      return data;
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === "object") {
        Object.entries(data).forEach(([field, msgs]) => {
          const msg = Array.isArray(msgs) ? msgs[0] : String(msgs);
          toast.error(`${field}: ${msg}`);
        });
        return rejectWithValue(data);
      }
      const msg = err?.message || "Failed to post job";
      toast.error(msg);
      return rejectWithValue({ detail: msg });
    }
  }
);

// NEW: Async thunk for fetching a single job
export const fetchJobById = createAsyncThunk(
  "jobs/fetchById",
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await getJob(jobId);
      return { jobId, data };
    } catch (error) {
      return rejectWithValue({ 
        jobId, 
        error: error?.message || "Failed to fetch job" 
      });
    }
  }
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    // === existing form reducers (unchanged) ===
    updateJobField: (state, action) => {
      const { name, value } = action.payload || {};
      if (name in state.form) state.form[name] = value;
    },
    setJobServices: (state, action) => {
      state.form.services = action.payload || [];
    },
    resetJobForm: (state) => {
      state.form = { ...initialState.form };
      state.error = null;
      state.created = null;
    },

    // === NEW: public-list UI togglers (migrated from old jobSlice) ===
    addLatestJob: (state, { payload }) => {
      const list = state.browse.latestJob;
      const exists = list?.includes(payload);
      state.browse.latestJob = exists ? list.filter(i => i !== payload) : [...list, payload];
    },
    clearJobTypeToggle: (state) => {
      state.browse.jobTypeList.forEach((i) => { i.isChecked = false; });
    },
    jobTypeCheck: (state, { payload }) => {
      state.browse.jobTypeList.forEach((i) => {
        if (i.id === payload) i.isChecked = !i.isChecked;
      });
    },
    datePostCheck: (state, { payload }) => {
      state.browse.datePost.forEach((i) => { i.isChecked = (i.id === payload); });
    },
    clearDatePostToggle: (state) => {
      state.browse.datePost.forEach((i) => { i.isChecked = false; });
    },
    experienceLavelCheck: (state, { payload }) => {
      state.browse.experienceLavel.forEach((i) => {
        if (i.id === payload) i.isChecked = !i.isChecked;
      });
    },
    clearExperienceToggle: (state) => {
      state.browse.experienceLavel.forEach((i) => { i.isChecked = false; });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitJob.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.created = null;
      })
      .addCase(submitJob.fulfilled, (state, action) => {
        state.submitting = false;
        state.created = action.payload;
        state.form = { ...initialState.form };
        toast.success("Job posted successfully");
      })
      .addCase(submitJob.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || { detail: "Failed to post job" };
        if (state.error?.detail) toast.error(state.error.detail);
      })
      // NEW: Handle fetchJobById
      .addCase(fetchJobById.pending, (state, action) => {
        const jobId = action.meta.arg;
        state.fetchingJobs[jobId] = true;
        state.fetchErrors[jobId] = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        const { jobId, data } = action.payload;
        state.fetchedJobs[jobId] = data;
        state.fetchingJobs[jobId] = false;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        const { jobId, error } = action.payload || {};
        state.fetchingJobs[jobId] = false;
        state.fetchErrors[jobId] = error || "Failed to fetch job";
      });
  },
});

export const {
  // form actions
  updateJobField, setJobServices, resetJobForm,
  // public-list UI actions
  addLatestJob, clearJobTypeToggle, jobTypeCheck,
  datePostCheck, clearDatePostToggle,
  experienceLavelCheck, clearExperienceToggle,
} = jobsSlice.actions;

// NEW: Selectors for fetched jobs
export const selectJobById = (state, jobId) => state.jobs.fetchedJobs[jobId];
export const selectJobLoading = (state, jobId) => state.jobs.fetchingJobs[jobId];
export const selectJobError = (state, jobId) => state.jobs.fetchErrors[jobId];

// selectors
export const selectJobForm        = (s) => s.jobs.form;
export const selectJobSubmitting  = (s) => s.jobs.submitting;
export const selectJobCreated     = (s) => s.jobs.created;
export const selectJobBrowseState = (s) => s.jobs.browse;

export default jobsSlice.reducer;
