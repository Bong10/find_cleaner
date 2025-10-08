import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCleaners, getCleanerById } from "@/services/cleanerService";

// Async thunk to fetch all cleaners
export const fetchCleaners = createAsyncThunk(
  "users/fetchCleaners",
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log("Fetching cleaners with params:", params);
      const response = await getAllCleaners(params);
      console.log("Cleaners response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching cleaners:", error);
      return rejectWithValue(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to fetch cleaners"
      );
    }
  }
);

// Async thunk to fetch single cleaner
export const fetchCleanerById = createAsyncThunk(
  "users/fetchCleanerById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getCleanerById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to fetch cleaner details"
      );
    }
  }
);

const initialState = {
  cleaners: [],
  selectedCleaner: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
  filters: {},
  sortBy: "-date_joined",
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = {};
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSelectedCleaner: (state, action) => {
      state.selectedCleaner = action.payload;
    },
    clearSelectedCleaner: (state) => {
      state.selectedCleaner = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cleaners cases
      .addCase(fetchCleaners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCleaners.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both paginated and non-paginated responses
        if (action.payload && Array.isArray(action.payload)) {
          // Non-paginated response
          state.cleaners = action.payload;
          state.totalCount = action.payload.length;
        } else if (action.payload && action.payload.results) {
          // Paginated response
          state.cleaners = action.payload.results;
          state.totalCount = action.payload.count;
        } else {
          state.cleaners = [];
          state.totalCount = 0;
        }
        state.error = null;
      })
      .addCase(fetchCleaners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cleaners";
        state.cleaners = [];
        state.totalCount = 0;
      })
      // Fetch single cleaner cases
      .addCase(fetchCleanerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCleanerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCleaner = action.payload;
        state.error = null;
      })
      .addCase(fetchCleanerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cleaner details";
        // Don't clear selectedCleaner on error - keep cached data
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setCurrentPage,
  setPageSize,
  setSortBy,
  setSelectedCleaner,
  clearSelectedCleaner,
} = usersSlice.actions;

export default usersSlice.reducer;