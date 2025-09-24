// store/slices/cleanerProfileSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  getCleanerMe,
  patchCleanerMe,
  getCurrentUser,
  patchCurrentUser,
  uploadUserAvatar,
} from "@/services/cleanerService";

const log = (...a) => console.debug("[cleanerProfileSlice]", ...a);

/** ---------- state ---------- */
const initialState = {
  status: "idle",
  error: null,

  user: {
    email: "",
    name: "",
    gender: "",
    phone_number: "",
    address: "",
    profile_picture: null,
  },

  portfolio: "",
  years_of_experience: 0,
  dbs_check: false,
  insurance_details: "",
  availibility_status: false,
  clean_level: 0,

  avatarFile: null,
  avatarUploading: false,
};

/** ---------- thunks ---------- */

// Load cleaner + nested user
export const loadCleanerProfile = createAsyncThunk(
  "cleanerProfile/load",
  async (_, { rejectWithValue }) => {
    try {
      log("→ GET /api/users/cleaners/me/");
      const { data } = await getCleanerMe();
      log("OK load", data);
      return data;
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to load profile";
      log("ERR load", msg);
      return rejectWithValue(msg);
    }
  }
);

// Upload avatar (to /auth/users/me/)
export const uploadAvatar = createAsyncThunk(
  "cleanerProfile/uploadAvatar",
  async (_, { getState, rejectWithValue }) => {
    const f = getState().cleanerProfile.avatarFile;
    if (!f) return rejectWithValue("No file selected");
    try {
      log("→ PATCH /auth/users/me/ (multipart) profile_picture:", f?.name);
      const { data } = await uploadUserAvatar(f);
      log("OK upload", data);
      return data; // returns user object
    } catch (err) {
      const msg =
        err?.response?.data?.profile_picture?.[0] ||
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to upload photo";
      log("ERR upload", msg, err?.response?.data);
      return rejectWithValue(msg);
    }
  }
);

// Delete avatar (set profile_picture null on /auth/users/me/)
export const deleteAvatar = createAsyncThunk(
  "cleanerProfile/deleteAvatar",
  async (_, { rejectWithValue }) => {
    try {
      log("→ PATCH /auth/users/me/ { profile_picture: null }");
      const { data } = await patchCurrentUser({ profile_picture: null });
      log("OK delete avatar", data);
      return data; // user
    } catch (err) {
      const msg =
        err?.response?.data?.profile_picture?.[0] ||
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to remove photo";
      log("ERR delete avatar", msg, err?.response?.data);
      return rejectWithValue(msg);
    }
  }
);

// Save text fields: first user, then cleaner; finally reload cleaner.me
export const saveCleanerProfile = createAsyncThunk(
  "cleanerProfile/save",
  async (_, { getState, rejectWithValue }) => {
    const s = getState().cleanerProfile;

    const userPayload = {
      name: s.user?.name ?? "",
      gender: s.user?.gender ?? "",
      phone_number: s.user?.phone_number ?? "",
      address: s.user?.address ?? "",
    };

    const cleanerPayload = {
      portfolio: s.portfolio ?? "",
      years_of_experience: Number(s.years_of_experience || 0),
      dbs_check: !!s.dbs_check,
      insurance_details: s.insurance_details ?? "",
      availibility_status: !!s.availibility_status,
      clean_level: Number(s.clean_level || 0),
    };

    try {
      log("→ PATCH /auth/users/me/", userPayload);
      await patchCurrentUser(userPayload);

      log("→ PATCH /api/users/cleaners/me/", cleanerPayload);
      await patchCleanerMe(cleanerPayload);

      log("→ reload cleaner.me");
      const { data } = await getCleanerMe();
      log("OK save flow", data);
      return data;
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to save profile";
      log("ERR save flow", msg, err?.response?.data);
      return rejectWithValue(msg);
    }
  }
);

/** ---------- slice ---------- */
const sl = createSlice({
  name: "cleanerProfile",
  initialState,
  reducers: {
    setCleanerField(state, { payload }) {
      log("setCleanerField", payload);
      const { path, value } = payload || {};
      if (!path) return;
      if (path.startsWith("user.")) {
        const key = path.slice(5);
        state.user = { ...state.user, [key]: value };
      } else {
        state[path] = value;
      }
    },
    setAvatarFile(state, { payload }) {
      log("setAvatarFile", payload?.name, payload?.type, payload?.size);
      state.avatarFile = payload || null; // File is fine in state for this UI
    },
    resetAvatarFile(state) {
      log("resetAvatarFile");
      state.avatarFile = null;
    },
  },
  extraReducers: (b) => {
    // LOAD
    b.addCase(loadCleanerProfile.pending, (s) => {
      s.status = "loading";
      s.error = null;
    });
    b.addCase(loadCleanerProfile.fulfilled, (s, a) => {
      s.status = "succeeded";
      const d = a.payload || {};
      s.user = {
        email: d?.user?.email || "",
        name: d?.user?.name || "",
        gender: d?.user?.gender || "",
        phone_number: d?.user?.phone_number || "",
        address: d?.user?.address || "",
        profile_picture: d?.user?.profile_picture || null,
      };
      s.portfolio = d?.portfolio || "";
      s.years_of_experience = d?.years_of_experience ?? 0;
      s.dbs_check = !!d?.dbs_check;
      s.insurance_details = d?.insurance_details || "";
      s.availibility_status = !!d?.availibility_status;
      s.clean_level = d?.clean_level ?? 0;
      s.avatarFile = null;
      log("state after load", s);
    });
    b.addCase(loadCleanerProfile.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.payload || a.error?.message;
      toast.error(s.error);
    });

    // UPLOAD AVATAR
    b.addCase(uploadAvatar.pending, (s) => {
      s.avatarUploading = true;
      s.error = null;
    });
    b.addCase(uploadAvatar.fulfilled, (s, a) => {
      s.avatarUploading = false;
      const user = a.payload || {};
      s.user = {
        ...s.user,
        profile_picture: user?.profile_picture || s.user.profile_picture,
      };
      s.avatarFile = null;
      toast.success("Photo uploaded");
    });
    b.addCase(uploadAvatar.rejected, (s, a) => {
      s.avatarUploading = false;
      s.error = a.payload || a.error?.message;
      toast.error(s.error || "Failed to upload photo");
    });

    // DELETE AVATAR
    b.addCase(deleteAvatar.pending, (s) => {
      s.avatarUploading = true;
      s.error = null;
    });
    b.addCase(deleteAvatar.fulfilled, (s, a) => {
      s.avatarUploading = false;
      const user = a.payload || {};
      s.user = {
        ...s.user,
        profile_picture: user?.profile_picture || null,
      };
      s.avatarFile = null;
      toast.success("Photo removed");
    });
    b.addCase(deleteAvatar.rejected, (s, a) => {
      s.avatarUploading = false;
      s.error = a.payload || a.error?.message;
      toast.error(s.error || "Failed to remove photo");
    });

    // SAVE (text)
    b.addCase(saveCleanerProfile.pending, (s) => {
      s.status = "loading";
      s.error = null;
    });
    b.addCase(saveCleanerProfile.fulfilled, (s, a) => {
      s.status = "succeeded";
      const d = a.payload || {};
      s.user = {
        email: d?.user?.email || "",
        name: d?.user?.name || "",
        gender: d?.user?.gender || "",
        phone_number: d?.user?.phone_number || "",
        address: d?.user?.address || "",
        profile_picture: d?.user?.profile_picture ?? s.user.profile_picture,
      };
      s.portfolio = d?.portfolio || "";
      s.years_of_experience = d?.years_of_experience ?? 0;
      s.dbs_check = !!d?.dbs_check;
      s.insurance_details = d?.insurance_details || "";
      s.availibility_status = !!d?.availibility_status;
      s.clean_level = d?.clean_level ?? 0;
      s.avatarFile = null;
      toast.success("Profile saved");
    });
    b.addCase(saveCleanerProfile.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.payload || a.error?.message;
      toast.error(s.error || "Failed to save profile");
    });
  },
});

export const { setCleanerField, setAvatarFile, resetAvatarFile } = sl.actions;
export const selectCleanerProfile = (s) => s.cleanerProfile;
export default sl.reducer;
