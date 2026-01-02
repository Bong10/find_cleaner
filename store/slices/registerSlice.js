// @/store/slices/registerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "@/services/authService";

export const registerCleaner = createAsyncThunk(
  "register/cleaner",
  async ({ email, password }, thunkAPI) => {
    try {
      const data = await AuthService.registerCleaner({ email, password });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const registerEmployer = createAsyncThunk(
  "register/employer",
  async ({ email, password }, thunkAPI) => {
    try {
      const data = await AuthService.registerEmployer({ email, password });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

const initialState = {
  cleanerLoading: false,
  cleanerError: null,
  employerLoading: false,
  employerError: null,
  lastSuccessRole: null, // "cleaner" | "employer" | null
};

const slice = createSlice({
  name: "register",
  initialState,
  reducers: {
    resetRegisterState: () => initialState,
  },
  extraReducers: (builder) => {
    // Cleaner
    builder
      .addCase(registerCleaner.pending, (s) => {
        s.cleanerLoading = true;
        s.cleanerError = null;
        s.lastSuccessRole = null;
      })
      .addCase(registerCleaner.fulfilled, (s) => {
        s.cleanerLoading = false;
        s.lastSuccessRole = "cleaner";
      })
      .addCase(registerCleaner.rejected, (s, a) => {
        s.cleanerLoading = false;
        s.cleanerError = a.payload || "Registration failed";
      });

    // Employer
    builder
      .addCase(registerEmployer.pending, (s) => {
        s.employerLoading = true;
        s.employerError = null;
        s.lastSuccessRole = null;
      })
      .addCase(registerEmployer.fulfilled, (s) => {
        s.employerLoading = false;
        s.lastSuccessRole = "employer";
      })
      .addCase(registerEmployer.rejected, (s, a) => {
        s.employerLoading = false;
        s.employerError = a.payload || "Registration failed";
      });
  },
});

export const { resetRegisterState } = slice.actions;
export default slice.reducer;
