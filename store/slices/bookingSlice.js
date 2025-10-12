// store/slices/bookingSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/axiosConfig";
import { toast } from "react-toastify";
import { createJob } from "@/services/jobsService";

// Book a cleaner for a job
export const bookCleaner = createAsyncThunk(
  "booking/bookCleaner",
  async ({ job, cleaner }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/job-bookings/book/", {
        job,
        cleaner
      });
      toast.success("Booking request sent to cleaner!");
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.detail || 
                     error?.response?.data?.message || 
                     "Failed to book cleaner";
      toast.error(message);
      return rejectWithValue({ error: message });
    }
  }
);

// Create job and book cleaner in one flow
export const createAndBookCleaner = createAsyncThunk(
  "booking/createAndBook",
  async ({ jobData, cleanerId }, { dispatch, rejectWithValue }) => {
    try {
      // Step 1: Create the job
      const jobResponse = await createJob(jobData);
      const jobId = jobResponse.id || jobResponse.job_id;
      
      if (!jobId) {
        throw new Error("Failed to get job ID after creation");
      }
      
      toast.success("Job created successfully!");
      
      // Step 2: Book the cleaner for this job
      const bookingResult = await dispatch(bookCleaner({ 
        job: jobId, 
        cleaner: cleanerId 
      })).unwrap();
      
      return {
        job: jobResponse,
        booking: bookingResult
      };
    } catch (error) {
      const message = error?.message || "Failed to create job and book cleaner";
      toast.error(message);
      return rejectWithValue({ error: message });
    }
  }
);

// Get booking status
export const getBookingStatus = createAsyncThunk(
  "booking/getStatus",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/job-bookings/${bookingId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue({ 
        error: error?.response?.data?.detail || "Failed to fetch booking status" 
      });
    }
  }
);

// Cleaner confirms/rejects booking
export const respondToBooking = createAsyncThunk(
  "booking/respond",
  async ({ bookingId, accept, message }, { rejectWithValue }) => {
    try {
      const endpoint = accept ? "confirm" : "reject";
      const response = await api.post(`/api/job-bookings/${bookingId}/${endpoint}/`, {
        message
      });
      
      toast.success(accept ? "Booking confirmed!" : "Booking declined");
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.detail || "Failed to respond to booking";
      toast.error(message);
      return rejectWithValue({ error: message });
    }
  }
);

// Get my bookings (for cleaner)
export const getMyBookings = createAsyncThunk(
  "booking/getMyBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/job-bookings/my-bookings/");
      return response.data;
    } catch (error) {
      return rejectWithValue({ 
        error: error?.response?.data?.detail || "Failed to fetch bookings" 
      });
    }
  }
);

const initialState = {
  currentBooking: null,
  myBookings: [],
  loading: false,
  error: null,
  bookingStatus: null, // 'pending', 'confirmed', 'rejected', 'completed'
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
    resetBooking: (state) => {
      state.currentBooking = null;
      state.bookingStatus = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Book cleaner
      .addCase(bookCleaner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookCleaner.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.bookingStatus = 'pending';
      })
      .addCase(bookCleaner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })
      
      // Create and book
      .addCase(createAndBookCleaner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndBookCleaner.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload.booking;
        state.bookingStatus = 'pending';
      })
      .addCase(createAndBookCleaner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })
      
      // Get booking status
      .addCase(getBookingStatus.fulfilled, (state, action) => {
        state.currentBooking = action.payload;
        state.bookingStatus = action.payload.status;
      })
      
      // Respond to booking
      .addCase(respondToBooking.fulfilled, (state, action) => {
        state.currentBooking = action.payload;
        state.bookingStatus = action.payload.status;
      })
      
      // Get my bookings
      .addCase(getMyBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.myBookings = action.payload;
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      });
  },
});

export const { clearBookingError, resetBooking } = bookingSlice.actions;

// Selectors
export const selectCurrentBooking = (state) => state.booking.currentBooking;
export const selectMyBookings = (state) => state.booking.myBookings;
export const selectBookingLoading = (state) => state.booking.loading;
export const selectBookingError = (state) => state.booking.error;
export const selectBookingStatus = (state) => state.booking.bookingStatus;

export default bookingSlice.reducer;