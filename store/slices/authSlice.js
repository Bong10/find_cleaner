// @/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "@/services/authService";

/** LOGIN */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const data = await AuthService.login(email, password); // { access }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

/** CURRENT USER */
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const data = await AuthService.getCurrentUser();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

/** REHYDRATE access from localStorage */
export const rehydrateAuth = createAsyncThunk(
  "auth/rehydrateAuth",
  async (_, thunkAPI) => {
    try {
      const access =
        typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      return { access };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message || "rehydrate failed");
    }
  }
);

/** BOOTSTRAP on app start: rehydrate then try /me (interceptor will refresh if needed) */
export const bootstrapAuth = createAsyncThunk(
  "auth/bootstrapAuth",
  async (_, { dispatch }) => {
    const rehydrate = await dispatch(rehydrateAuth());
    const access = rehydrate?.payload?.access;

    if (access) {
      try {
        await dispatch(fetchCurrentUser()).unwrap();
      } catch {
        // If /me fails with 401, axios interceptor will attempt refresh.
        // If refresh fails too, user stays unauthenticated.
      }
    }
    return true;
  }
);

/** LOGOUT (thunk): clear client FIRST, then tell server to clear cookie */
export const performLogout = createAsyncThunk(
  "auth/performLogout",
  async (_, { dispatch }) => {
    // Immediate client-side reset
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.setItem("auth_logged_out_at", String(Date.now()));
    }
    dispatch(clearAuthState());

    // Ask backend to clear cookie (no auth required)
    try {
      await AuthService.logoutUser();
    } catch (_) {}
    return true;
  }
);

const initialState = {
  user: null,
  access: null,
  isAuthenticated: false,
  role: null,

  loading: false,      // login in-flight
  userLoading: false,  // /me in-flight
  bootstrapping: true, // gate UI until bootstrap completes

  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** Pure, synchronous state reset */
    clearAuthState: (state) => {
      state.user = null;
      state.access = null;
      state.isAuthenticated = false;
      state.role = null;
      state.error = null;
      state.userLoading = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.access = action.payload?.access || null;
        state.isAuthenticated = !!action.payload?.access;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload || "Login failed";
      })

      // FETCH CURRENT USER
      .addCase(fetchCurrentUser.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.userLoading = false;
        state.user = action.payload || null;
        state.role = action.payload?.role || null;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.userLoading = false;
      })

      // REHYDRATE
      .addCase(rehydrateAuth.fulfilled, (state, action) => {
        const access = action.payload?.access || null;
        state.access = access;
        state.isAuthenticated = !!access;
      })

      // BOOTSTRAP
      .addCase(bootstrapAuth.fulfilled, (state) => {
        state.bootstrapping = false;
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.bootstrapping = false;
      })

      // LOGOUT done (state already cleared)
      .addCase(performLogout.fulfilled, (state) => {})
      .addCase(performLogout.rejected, (state) => {});
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
