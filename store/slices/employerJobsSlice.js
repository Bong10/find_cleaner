// store/slices/employerJobsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosConfig";

// Fetch employer's jobs
export const fetchEmployerJobs = createAsyncThunk(
  "employerJobs/fetch",
  async ({ status = "all" }, { rejectWithValue }) => {
    try {
      const params = status !== "all" ? { status } : {};
      const response = await axiosInstance.get("/api/employer/jobs/", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch jobs");
    }
  }
);

// Assign cleaner to job
export const assignCleanerToJob = createAsyncThunk(
  "employerJobs/assignCleaner",
  async ({ jobId, cleanerId, message }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/jobs/${jobId}/assign/`, {
        cleaner_id: cleanerId,
        message,
        status: "pending_confirmation"
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to assign cleaner");
    }
  }
);

const employerJobsSlice = createSlice({
  name: "employerJobs",
  initialState: {
    jobs: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearJobs: (state) => {
      state.jobs = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployerJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployerJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchEmployerJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(assignCleanerToJob.fulfilled, (state, action) => {
        // Update the job in the list if needed
        const jobIndex = state.jobs.findIndex(j => j.id === action.payload.id);
        if (jobIndex !== -1) {
          state.jobs[jobIndex] = action.payload;
        }
      });
  },
});

export const { clearJobs } = employerJobsSlice.actions;
export default employerJobsSlice.reducer;