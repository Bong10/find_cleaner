import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getShortlistedJobs } from "@/services/cleanerService";
import { listApplications } from "@/services/jobsService";

// Fetch dashboard metrics - Using proper applications endpoint
export const fetchMetrics = createAsyncThunk(
  'metrics/fetch',
  async (_, { rejectWithValue }) => {
    try {
      // Get applied jobs from the job-applications endpoint
      const applicationsResponse = await listApplications();
      console.log('Applications Response:', applicationsResponse);
      
      // Get shortlisted jobs
      const shortlistResponse = await getShortlistedJobs();
      console.log('Shortlist Response:', shortlistResponse);
      
      // Handle both paginated and non-paginated responses
      const applications = applicationsResponse?.data?.results || applicationsResponse?.data || [];
      const shortlisted = shortlistResponse?.data?.results || shortlistResponse?.data || [];
      
      // Use actual applications count
      const metrics = {
        appliedJobs: applications.length,
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
      
      // Try to get from localStorage as fallback
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

// Update a single metric
export const updateMetric = createAsyncThunk(
  'metrics/updateSingle',
  async ({ key, value }) => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('dashboard_metrics');
      const metrics = cached ? JSON.parse(cached) : {
        appliedJobs: 0,
        jobAlerts: 0,
        messages: 0,
        shortlisted: 0
      };
      
      metrics[key] = value;
      localStorage.setItem('dashboard_metrics', JSON.stringify(metrics));
      
      return { key, value };
    }
    return { key, value };
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
    },
    lastFetch: null
  },
  reducers: {
    updateDashboardMetric: (state, action) => {
      const { key, value } = action.payload;
      if (state.dashboardMetrics.hasOwnProperty(key)) {
        state.dashboardMetrics[key] = value;
        
        // Also update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('dashboard_metrics', JSON.stringify(state.dashboardMetrics));
        }
      }
    },
    incrementAppliedJobs: (state) => {
      state.dashboardMetrics.appliedJobs += 1;
      
      // Also update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('dashboard_metrics', JSON.stringify(state.dashboardMetrics));
      }
    },
    incrementShortlisted: (state) => {
      state.dashboardMetrics.shortlisted += 1;
      
      // Also update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('dashboard_metrics', JSON.stringify(state.dashboardMetrics));
      }
    },
    decrementShortlisted: (state) => {
      if (state.dashboardMetrics.shortlisted > 0) {
        state.dashboardMetrics.shortlisted -= 1;
        
        // Also update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('dashboard_metrics', JSON.stringify(state.dashboardMetrics));
        }
      }
    },
    resetMetrics: (state) => {
      state.dashboardMetrics = {
        appliedJobs: 0,
        jobAlerts: 0,
        messages: 0,
        shortlisted: 0
      };
      state.lastFetch = null;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('dashboard_metrics');
        localStorage.removeItem('last_metrics_fetch');
      }
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
      s.lastFetch = new Date().toISOString();
      s.error = null;
    });
    b.addCase(fetchMetrics.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload || 'Failed to fetch metrics';
    });

    // loadCachedMetrics cases
    b.addCase(loadCachedMetrics.fulfilled, (s, a) => {
      s.dashboardMetrics = a.payload;
    });
    
    // updateMetric cases
    b.addCase(updateMetric.fulfilled, (s, a) => {
      const { key, value } = a.payload;
      if (s.dashboardMetrics.hasOwnProperty(key)) {
        s.dashboardMetrics[key] = value;
      }
    });
  },
});

// Export actions
export const { 
  updateDashboardMetric, 
  incrementAppliedJobs,
  incrementShortlisted,
  decrementShortlisted,
  resetMetrics 
} = metricsSlice.actions;

// SELECTORS
export const selectDashboardMetrics = (state) => state.metrics.dashboardMetrics;
export const selectAppliedJobsCount = (state) => state.metrics.dashboardMetrics?.appliedJobs || 0;
export const selectJobAlertsCount = (state) => state.metrics.dashboardMetrics?.jobAlerts || 0;
export const selectMessagesCount = (state) => state.metrics.dashboardMetrics?.messages || 0;
export const selectShortlistCount = (state) => state.metrics.dashboardMetrics?.shortlisted || 0;
export const selectMetricsLoading = (state) => state.metrics.loading;
export const selectMetricsError = (state) => state.metrics.error;
export const selectLastFetch = (state) => state.metrics.lastFetch;

export default metricsSlice.reducer;
