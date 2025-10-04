import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getJobs, getShortlistedJobs } from "@/services/cleanerService";

// Fetch dashboard metrics - SIMPLE VERSION
export const fetchMetrics = createAsyncThunk(
  'metrics/fetch',
  async (_, { rejectWithValue }) => {
    try {
      // Get all jobs and use its length as applied jobs count
      const jobsResponse = await getJobs();
      console.log('Jobs Response:', jobsResponse);
      
      // Get shortlisted jobs
      const shortlistResponse = await getShortlistedJobs();
      console.log('Shortlist Response:', shortlistResponse);
      
      const jobs = jobsResponse?.data || [];
      const shortlisted = shortlistResponse?.data || [];
      
      // SIMPLE: Use jobs array length as applied jobs count
      const metrics = {
        appliedJobs: jobs.length,  // Just use the length!
        jobAlerts: 0,
        messages: 0,
        shortlisted: shortlisted.length
      };

      console.log('Dashboard metrics:', metrics);

      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('dashboard_metrics', JSON.stringify(metrics));
        localStorage.setItem('last_metrics_fetch', new Date().toISOString());
      }

      return metrics;
    } catch (error) {
      console.error('Error in fetchMetrics:', error);
      return {
        appliedJobs: 0,
        jobAlerts: 0,
        messages: 0,
        shortlisted: 0
      };
    }
  }
);

// Load metrics from localStorage
export const loadCachedMetrics = createAsyncThunk(
  'metrics/loadCached',
  async () => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('dashboard_metrics');
      if (cached) {
        return JSON.parse(cached);
      }
    }
    return {
      appliedJobs: 0,
      jobAlerts: 0,
      messages: 0,
      shortlisted: 0
    };
  }
);

const metricsSlice = createSlice({
  name: "metrics",
  initialState: {
    loading: false,
    error: null,
    // Dashboard metrics
    dashboardMetrics: {
      appliedJobs: 0,
      jobAlerts: 0,
      messages: 0,
      shortlisted: 0
    }
  },
  reducers: {
    updateDashboardMetric: (state, action) => {
      const { key, value } = action.payload;
      if (state.dashboardMetrics.hasOwnProperty(key)) {
        state.dashboardMetrics[key] = value;
      }
    },
    resetMetrics: (state) => {
      state.dashboardMetrics = {
        appliedJobs: 0,
        jobAlerts: 0,
        messages: 0,
        shortlisted: 0
      };
    }
  },
  extraReducers: (b) => {
    // fetchMetrics cases
    b.addCase(fetchMetrics.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchMetrics.fulfilled, (s, a) => {
      s.loading = false;
      s.dashboardMetrics = a.payload;
      s.error = null;
    });
    b.addCase(fetchMetrics.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload;
    });

    // loadCachedMetrics cases
    b.addCase(loadCachedMetrics.fulfilled, (s, a) => {
      s.dashboardMetrics = a.payload;
    });
  },
});

// Export actions
export const { updateDashboardMetric, resetMetrics } = metricsSlice.actions;

// SELECTORS
export const selectDashboardMetrics = (state) => state.metrics.dashboardMetrics;
export const selectAppliedJobsCount = (state) => state.metrics.dashboardMetrics?.appliedJobs || 0;
export const selectJobAlertsCount = (state) => state.metrics.dashboardMetrics?.jobAlerts || 0;
export const selectMessagesCount = (state) => state.metrics.dashboardMetrics?.messages || 0;
export const selectShortlistCount = (state) => state.metrics.dashboardMetrics?.shortlisted || 0;
export const selectMetricsLoading = (state) => state.metrics.loading;
export const selectMetricsError = (state) => state.metrics.error;

export default metricsSlice.reducer;
