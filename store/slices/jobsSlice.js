// store/slices/jobsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  getJob, 
  getJobEmployer, 
  listApplications 
} from "@/services/jobsService";
import { incrementAppliedJobs } from "./metricsSlice";

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
  currentJob: null,
  loading: false,
  error: null,
  myApplications: [],
  applicationsLoading: false,
  applicationsError: null,
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearApplications: (state) => {
      state.myApplications = [];
    },
  },
  extraReducers: (builder) => {
    builder
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

export const { clearCurrentJob, clearApplications } = jobsSlice.actions;
export default jobsSlice.reducer;
