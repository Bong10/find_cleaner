// store/slices/employerProfileSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  getCurrentUser,
  patchCurrentUser,
  patchCurrentUserMultipart, // <-- use this for profile_picture
  getEmployerMe,
  patchEmployerMe,
  patchEmployerMeMultipart, // still used for cover, if you keep it
} from "@/services/employerService";

const splitName = (name = "") => {
  const parts = (name || "").trim().split(/\s+/);
  return { first_name: parts[0] || "", last_name: parts.slice(1).join(" ") || "" };
};
const mergeName = (first, last) => [first || "", last || ""].join(" ").trim();

// ---------- FETCH ----------
export const fetchEmployerProfile = createAsyncThunk(
  "employerProfile/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const [uRes, eRes] = await Promise.all([getCurrentUser(), getEmployerMe()]);
      return { user: uRes.data, employer: eRes.data };
    } catch (err) {
      const detail =
        err?.response?.data?.detail || err?.message || "Failed to load profile";
      toast.error(detail);
      return rejectWithValue(detail);
    }
  }
);

// ---------- SAVE (text fields only) ----------
export const saveEmployerProfile = createAsyncThunk(
  "employerProfile/save",
  async (formValues, { rejectWithValue }) => {
    try {
      const {
        first_name, last_name, phone_number, gender, address, business_name,
      } = formValues;

      // Update user (name/phone/gender/address)
      await patchCurrentUser({
        name: mergeName(first_name, last_name),
        phone_number: phone_number ?? null,
        gender: gender ?? null,
        address: address ?? "",
      });

      // Update employer; mirror location to address
      const eRes = await patchEmployerMe({
        business_name: business_name ?? "",
        location: address ?? "",
      });

      toast.success("Profile saved");
      return { employer: eRes.data };
    } catch (err) {
      const api = err?.response?.data;
      const msg =
        api?.phone_number?.[0] ||
        api?.detail ||
        api?.non_field_errors?.[0] ||
        err?.message ||
        "Failed to save profile";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// ---------- UPLOAD: LOGO (maps to user.profile_picture) ----------
export const uploadEmployerLogo = createAsyncThunk(
  "employerProfile/uploadLogo",
  async (file, { rejectWithValue }) => {
    try {
      const fd = new FormData();
      fd.append("profile_picture", file); // <-- IMPORTANT
      const res = await patchCurrentUserMultipart(fd); // <-- PATCH /auth/users/me/
      toast.success("Logo updated");
      return { user: res.data };
    } catch (err) {
      const msg =
        err?.response?.data?.profile_picture?.[0] ||
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to upload logo";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// ---------- UPLOAD: COVER (still on employer/me if you keep it) ----------
export const uploadEmployerCover = createAsyncThunk(
  "employerProfile/uploadCover",
  async (file, { rejectWithValue }) => {
    try {
      const fd = new FormData();
      fd.append("cover_image", file);
      const res = await patchEmployerMeMultipart(fd);
      toast.success("Cover updated");
      return { employer: res.data };
    } catch (err) {
      const msg =
        err?.response?.data?.cover_image?.[0] ||
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to upload cover";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

const initialState = {
  // UI-friendly fields
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  gender: "",
  address: "",
  business_name: "",

  // MEDIA (persisted)
  logo: "",         // <- this mirrors user.profile_picture
  cover_image: "",  // <- still employer side (if present)

  // raw
  user: null,
  employer: null,

  status: "idle",
  error: null,
  saving: false,
  uploadingLogo: false,
  uploadingCover: false,
};

const employerProfileSlice = createSlice({
  name: "employerProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // FETCH
    builder.addCase(fetchEmployerProfile.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchEmployerProfile.fulfilled, (state, action) => {
      state.status = "succeeded";
      const user = action.payload?.user || {};
      const employer = action.payload?.employer || {};
      state.user = user;
      state.employer = employer;

      const { first_name, last_name } = splitName(user?.name || "");
      state.first_name = first_name;
      state.last_name = last_name;
      state.email = user?.email || "";
      state.phone_number = user?.phone_number || "";
      state.gender = user?.gender || "";
      state.address = user?.address || employer?.location || "";
      state.business_name = employer?.business_name || "";

      // CRITICAL: map logo from user.profile_picture
      state.logo = user?.profile_picture || ""; // <- persist + rehydrate logo
      // cover remains from employer (if your backend returns it)
      state.cover_image =
        employer?.cover_image || employer?.cover_url || employer?.cover_path || "";
    });
    builder.addCase(fetchEmployerProfile.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || action.error?.message || "Failed to load profile";
    });

    // SAVE
    builder.addCase(saveEmployerProfile.pending, (state) => {
      state.saving = true;
      state.error = null;
    });
    builder.addCase(saveEmployerProfile.fulfilled, (state, action) => {
      state.saving = false;
      const employer = action.payload?.employer || {};
      state.employer = employer;
      state.business_name = employer?.business_name || "";
      if (employer?.location) state.address = employer.location;

      // leave logo alone; logo lives on user.profile_picture
      if (employer?.cover_image || employer?.cover_url || employer?.cover_path) {
        state.cover_image =
          employer?.cover_image || employer?.cover_url || employer?.cover_path;
      }
    });
    builder.addCase(saveEmployerProfile.rejected, (state, action) => {
      state.saving = false;
      state.error = action.payload || action.error?.message || "Failed to save profile";
    });

    // UPLOAD LOGO (profile_picture)
    builder.addCase(uploadEmployerLogo.pending, (state) => {
      state.uploadingLogo = true;
    });
    builder.addCase(uploadEmployerLogo.fulfilled, (state, action) => {
      state.uploadingLogo = false;
      const user = action.payload?.user || {};
      state.user = user;
      state.logo = user?.profile_picture || ""; // <- update from PATCH response
    });
    builder.addCase(uploadEmployerLogo.rejected, (state) => {
      state.uploadingLogo = false;
    });

    // UPLOAD COVER (employer)
    builder.addCase(uploadEmployerCover.pending, (state) => {
      state.uploadingCover = true;
    });
    builder.addCase(uploadEmployerCover.fulfilled, (state, action) => {
      state.uploadingCover = false;
      const employer = action.payload?.employer || {};
      state.employer = employer;
      state.cover_image =
        employer?.cover_image || employer?.cover_url || employer?.cover_path || "";
    });
    builder.addCase(uploadEmployerCover.rejected, (state) => {
      state.uploadingCover = false;
    });
  },
});

export default employerProfileSlice.reducer;
export const selectEmployerProfile = (state) => state.employerProfile;
