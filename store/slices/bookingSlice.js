// store/slices/bookingSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cgsabiozard.co.uk";

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};

// Fetch all bookings
export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await axios.get(
        `${API_URL}/api/job-bookings/${params ? `?${params}` : ""}`,
        { headers: getAuthHeaders() }
      );
      // The API returns an array directly
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Fetch bookings error:", error);
      return rejectWithValue(error.response?.data?.detail || "Failed to fetch bookings");
    }
  }
);

// Create booking (employer books cleaner)
export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async ({ jobId, cleanerId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/job-bookings/book/`,
        {
          job: parseInt(jobId),
          cleaner: parseInt(cleanerId),
        },
        { headers: getAuthHeaders() }
      );
      
      // Store booking ID for quick access
      if (response.data.booking_id) {
        localStorage.setItem("lastBookingId", response.data.booking_id);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Booking failed");
    }
  }
);

// Cleaner confirms booking
export const confirmBooking = createAsyncThunk(
  "bookings/confirmBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/job-bookings/${bookingId}/confirm/`,
        {},
        { headers: getAuthHeaders() }
      );
      return { ...response.data, bookingId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Confirmation failed");
    }
  }
);

// Process payment
export const processPayment = createAsyncThunk(
  "bookings/processPayment",
  async ({ bookingId, paymentReference, paymentMethod, saveDetails }, { rejectWithValue }) => {
    try {
      // Save payment details for future use if requested
      if (saveDetails) {
        const savedPayments = JSON.parse(localStorage.getItem("savedPaymentMethods") || "[]");
        const newPayment = {
          id: Date.now(),
          method: paymentMethod,
          reference: paymentReference,
          lastUsed: new Date().toISOString(),
        };
        savedPayments.push(newPayment);
        localStorage.setItem("savedPaymentMethods", JSON.stringify(savedPayments));
      }
      
      // Store last payment details
      localStorage.setItem("lastPaymentMethod", paymentMethod);
      localStorage.setItem("lastPaymentReference", paymentReference);
      
      const response = await axios.post(
        `${API_URL}/api/job-bookings/${bookingId}/pay/`,
        { payment_reference: paymentReference },
        { headers: getAuthHeaders() }
      );
      
      return { ...response.data, bookingId, paymentReference };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Payment failed");
    }
  }
);

// Complete booking
export const completeBooking = createAsyncThunk(
  "bookings/completeBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/job-bookings/${bookingId}/complete/`,
        {},
        { headers: getAuthHeaders() }
      );
      return { ...response.data, bookingId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Completion failed");
    }
  }
);

// Submit review for cleaner
export const reviewCleaner = createAsyncThunk(
  "bookings/reviewCleaner",
  async ({ bookingId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/job-bookings/${bookingId}/review-cleaner/`,
        { rating, comment },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Review submission failed");
    }
  }
);

// Submit review for employer
export const reviewEmployer = createAsyncThunk(
  "bookings/reviewEmployer",
  async ({ bookingId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/job-bookings/${bookingId}/review-employer/`,
        { rating, comment },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Review submission failed");
    }
  }
);

// Get saved payment methods
export const getSavedPaymentMethods = createAsyncThunk(
  "bookings/getSavedPaymentMethods",
  async () => {
    const saved = localStorage.getItem("savedPaymentMethods");
    return saved ? JSON.parse(saved) : [];
  }
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
    currentBooking: null,
    savedPaymentMethods: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    },
    removeSavedPaymentMethod: (state, action) => {
      state.savedPaymentMethods = state.savedPaymentMethods.filter(
        (method) => method.id !== action.payload
      );
      localStorage.setItem(
        "savedPaymentMethods",
        JSON.stringify(state.savedPaymentMethods)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.bookings = [];
      })
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Booking created successfully!";
        state.currentBooking = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Confirm booking
      .addCase(confirmBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(confirmBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Booking confirmed! Awaiting payment from employer.";
        // Update booking in list - set cleaner_confirmed to true but keep status as 'p'
        const index = state.bookings.findIndex(
          (b) => b.booking_id === action.payload.bookingId
        );
        if (index !== -1) {
          state.bookings[index] = {
            ...state.bookings[index],
            cleaner_confirmed: true,
            status: 'p', // Keep as pending until payment
          };
        }
      })
      .addCase(confirmBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Process payment
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Payment processed successfully! Job confirmed.";
        // Update booking status to confirmed (cf)
        const index = state.bookings.findIndex(
          (b) => b.booking_id === action.payload.bookingId
        );
        if (index !== -1) {
          state.bookings[index] = {
            ...state.bookings[index],
            status: 'cf', // Now it's confirmed
            status_display: 'Confirmed',
            paid_at: new Date().toISOString(),
            payment_reference: action.payload.paymentReference,
          };
        }
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Complete booking
      .addCase(completeBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(completeBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Job marked as completed!";
        // Update booking status to completed (cp)
        const index = state.bookings.findIndex(
          (b) => b.booking_id === action.payload.bookingId
        );
        if (index !== -1) {
          state.bookings[index] = {
            ...state.bookings[index],
            status: 'cp', // Now it's completed
            status_display: 'Completed',
          };
        }
      })
      .addCase(completeBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reviews
      .addCase(reviewCleaner.fulfilled, (state) => {
        state.successMessage = "Review submitted successfully!";
      })
      .addCase(reviewEmployer.fulfilled, (state) => {
        state.successMessage = "Review submitted successfully!";
      })
      // Saved payment methods
      .addCase(getSavedPaymentMethods.fulfilled, (state, action) => {
        state.savedPaymentMethods = action.payload;
      });
  },
});

export const { clearMessages, setCurrentBooking, removeSavedPaymentMethod } = bookingSlice.actions;
export default bookingSlice.reducer;

// Selectors
export const selectBookings = (state) => state.bookings.items;
export const selectBookingStatus = (state) => state.bookings.status;
export const selectBookingError = (state) => state.bookings.error;
export const selectPaymentMethods = (state) => state.bookings.paymentMethods;
