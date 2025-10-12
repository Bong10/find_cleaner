// store/slices/jobsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  getJob, 
  getJobEmployer, 
  listApplications,
  createJob 
} from "@/services/jobsService";
import { incrementAppliedJobs } from "./metricsSlice";
import { toast } from "react-toastify";

// Submit job form
export const submitJob = createAsyncThunk(
  "jobs/submit",
  async (_, { getState, rejectWithValue }) => {
    const { jobs } = getState();
    const f = jobs.form;

    // Client-side validation
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

// Fetch job by ID
export const fetchJobById = createAsyncThunk(
  "jobs/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getJob(id);
      return response;
    } catch (error) {
      return rejectWithValue({ 
        error: error?.response?.data?.detail || error?.message || "Failed to fetch job" 
      });
    }
  }
);

// Fetch employer details
export const fetchJobEmployer = createAsyncThunk(
  "jobs/fetchEmployer",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await getJobEmployer(jobId);
      return response.data;
    } catch (error) {
      return rejectWithValue({ 
        error: error?.response?.data?.detail || error?.message || "Failed to fetch employer" 
      });
    }
  }
);

// Apply for a job
export const applyForJob = createAsyncThunk(
  "jobs/apply",
  async ({ job, cover_letter }, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/job-applications/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ job, cover_letter })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      
      const result = await response.json();
      
      // Increment the applied jobs count in metrics
      dispatch(incrementAppliedJobs());
      
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Fetch cleaner's applications
export const fetchMyApplications = createAsyncThunk(
  "jobs/fetchMyApplications",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await listApplications(params);
      // Handle both paginated and non-paginated responses
      const applications = response.data?.results || response.data || [];
      return applications;
    } catch (error) {
      return rejectWithValue({ 
        error: error?.response?.data?.detail || error?.message || "Failed to fetch applications" 
      });
    }
  }
);

const initialState = {
  // Job posting form state
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
  
  // Job fetching state
  currentJob: null,
  loading: false,
  
  // Applications state
  myApplications: [],
  applicationsLoading: false,
  applicationsError: null,
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    // Form actions
    updateJobField: (state, action) => {
      const { name, value } = action.payload || {};
      if (name in state.form) {
        state.form[name] = value;
      }
    },
    setJobServices: (state, action) => {
      state.form.services = action.payload || [];
    },
    resetJobForm: (state) => {
      state.form = { 
        title: "",
        description: "",
        location: "",
        date: "",
        time: "",
        hourly_rate: "",
        hours_required: 1,
        services: [],
      };
      state.error = null;
      state.created = null;
    },
    
    // Other actions
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearApplications: (state) => {
      state.myApplications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit job cases
      .addCase(submitJob.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.created = null;
      })
      .addCase(submitJob.fulfilled, (state, action) => {
        state.submitting = false;
        state.created = action.payload;
        state.form = { 
          title: "",
          description: "",
          location: "",
          date: "",
          time: "",
          hourly_rate: "",
          hours_required: 1,
          services: [],
        };
        toast.success("Job posted successfully!");
      })
      .addCase(submitJob.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || { detail: "Failed to post job" };
      })
      
      // Fetch job by ID
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch job";
      })
      
      // Fetch my applications
      .addCase(fetchMyApplications.pending, (state) => {
        state.applicationsLoading = true;
        state.applicationsError = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.applicationsLoading = false;
        state.myApplications = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.applicationsLoading = false;
        state.applicationsError = action.payload?.error || "Failed to fetch applications";
      });
  },
});

// Export actions
export const { 
  updateJobField, 
  setJobServices, 
  resetJobForm,
  clearCurrentJob, 
  clearApplications 
} = jobsSlice.actions;

// Export selectors
export const selectJobForm = (state) => state.jobs.form;
export const selectJobSubmitting = (state) => state.jobs.submitting;
export const selectJobError = (state) => state.jobs.error;
export const selectJobCreated = (state) => state.jobs.created;

export default jobsSlice.reducer;
