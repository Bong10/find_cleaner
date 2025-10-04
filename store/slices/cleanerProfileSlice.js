// store/slices/cleanerProfileSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  getCleanerMe,
  patchCleanerMe,
  getCurrentUser,
  patchCurrentUser,
  patchCurrentUserMultipart,  // ✅ Make sure this is imported
  uploadUserAvatar,
} from "@/services/cleanerService";

const log = (...a) => console.log("[cleanerProfileSlice]", ...a);

/** ---------- state ---------- */
const initialState = {
  status: "idle",
  error: null,

  // Backend data - User model
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

  // LocalStorage data - from onboarding
  localData: {
    // Step 3 data
    availability: {},
    hourly_rate: "",
    minimum_hours: "",
    service_types: [],
    service_areas: [],
    travel_fee_type: "",
    
    // Step 4 and other data
    date_of_birth: "",
    dbs_certificate_number: "",
    certifications: [],
    id_document: null,
    skills: [],
    specializations: [],
    preferred_working_hours: "",
    travel_distance: "",
    equipment_owned: [],
    languages: [],
  },

  // UI state
  avatarFile: null,
  avatarUploading: false,
  localDataLoaded: false,
};

/** ---------- Helper functions ---------- */

// Load all localStorage data for cleaner
const loadLocalStorageData = () => {
  try {
    const savedData = localStorage.getItem('cleaner_preferences');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      console.log("Loaded localStorage data:", parsed);
      return parsed;
    }
  } catch (err) {
    console.log("Error loading localStorage:", err);
  }
  return {};
};

// Save to localStorage
const saveToLocalStorage = (data) => {
  try {
    const existing = JSON.parse(localStorage.getItem('cleaner_preferences') || '{}');
    const updated = { ...existing, ...data };
    localStorage.setItem('cleaner_preferences', JSON.stringify(updated));
    console.log("Saved to localStorage:", updated);
    return updated;
  } catch (err) {
    console.log("Error saving to localStorage:", err);
    return data;
  }
};

/** ---------- thunks ---------- */

// Load complete cleaner profile (backend + localStorage)
export const loadCompleteCleanerProfile = createAsyncThunk(
  "cleanerProfile/loadComplete",
  async (_, { rejectWithValue }) => {
    try {
      console.log("→ Loading complete cleaner profile...");
      
      // Load from backend
      console.log("→ GET /api/users/cleaners/me/");
      const { data: backendData } = await getCleanerMe();
      console.log("✅ Backend data loaded:", backendData);
      
      // Load from localStorage
      const localData = loadLocalStorageData();
      console.log("✅ LocalStorage data loaded:", localData);
      
      return {
        backend: backendData,
        local: localData
      };
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to load profile";
      console.log("❌ Error loading profile:", msg);
      return rejectWithValue(msg);
    }
  }
);

// Save complete profile (backend fields to API, other fields to localStorage)
export const saveCompleteCleanerProfile = createAsyncThunk(
  "cleanerProfile/saveComplete",
  async (formData, { getState, rejectWithValue }) => {
    const state = getState().cleanerProfile;
    
    try {
      console.log("→ Saving complete cleaner profile...");
      
      // Prepare backend payloads
      const userPayload = {
        name: formData.name || state.user?.name || "",
        gender: formData.gender || state.user?.gender || "",
        phone_number: formData.phone_number || state.user?.phone_number || "",
        address: formData.address || state.user?.address || "",
      };

      const cleanerPayload = {
        portfolio: formData.bio || state.portfolio || "",
        years_of_experience: parseInt(formData.years_of_experience) || state.years_of_experience || 0,
        dbs_check: formData.dbs_check !== undefined ? formData.dbs_check : state.dbs_check,
        insurance_details: formData.insurance_details || state.insurance_details || "",
        availibility_status: formData.availibility_status !== undefined ? formData.availibility_status : state.availibility_status,
        clean_level: parseInt(formData.clean_level) || state.clean_level || 1,
      };

      // Prepare localStorage data
      const localStorageData = {
        availability: formData.availability || state.localData.availability,
        hourly_rate: formData.hourly_rate || state.localData.hourly_rate,
        minimum_hours: formData.minimum_hours || state.localData.minimum_hours,
        service_types: formData.service_types || state.localData.service_types,
        service_areas: formData.service_areas || state.localData.service_areas,
        travel_fee_type: formData.travel_fee_type || state.localData.travel_fee_type,
        date_of_birth: formData.date_of_birth || state.localData.date_of_birth,
        dbs_certificate_number: formData.dbs_certificate_number || state.localData.dbs_certificate_number,
        certifications: formData.certifications ? 
          (formData.certifications.map ? 
            formData.certifications.map(f => f.name || f) : 
            [formData.certifications.name || formData.certifications]) : 
          state.localData.certifications,
        id_document: formData.id_document?.name || state.localData.id_document,
        skills: formData.skills || state.localData.skills,
        specializations: formData.specializations || state.localData.specializations,
        preferred_working_hours: formData.preferred_working_hours || state.localData.preferred_working_hours,
        travel_distance: formData.travel_distance || state.localData.travel_distance,
        equipment_owned: formData.equipment_owned || state.localData.equipment_owned,
        languages: formData.languages || state.localData.languages,
      };

      // Save to backend
      console.log("→ PATCH /auth/users/me/", userPayload);
      await patchCurrentUser(userPayload);
      
      console.log("→ PATCH /api/users/cleaners/me/", cleanerPayload);
      await patchCleanerMe(cleanerPayload);
      
      // ✅ FIX: Handle profile picture upload PROPERLY
      if (formData.profile_picture instanceof File) {
        try {
          log("→ Uploading profile picture:", formData.profile_picture.name);
          const picFormData = new FormData();
          picFormData.append('profile_picture', formData.profile_picture);
          
          // Use the multipart upload function
          const uploadResponse = await patchCurrentUserMultipart(picFormData);
          log("✅ Profile picture uploaded successfully:", uploadResponse);
        } catch (error) {
          log("❌ Profile picture upload failed:", error.response?.data || error.message);
          // Don't fail the whole process for picture, but log the error
          console.error("Profile picture upload error:", error);
        }
      }
      
      // Save to localStorage
      const savedLocalData = saveToLocalStorage(localStorageData);
      
      // Reload complete profile
      console.log("→ Reloading complete profile...");
      const { data: reloadedData } = await getCleanerMe();
      
      console.log("✅ Complete save successful");
      return {
        backend: reloadedData,
        local: savedLocalData
      };
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to save profile";
      console.log("❌ Save error:", msg, err?.response?.data);
      return rejectWithValue(msg);
    }
  }
);

// Update only localStorage fields
export const updateLocalStorageFields = createAsyncThunk(
  "cleanerProfile/updateLocal",
  async (fields, { rejectWithValue }) => {
    try {
      console.log("→ Updating localStorage fields:", fields);
      const updated = saveToLocalStorage(fields);
      console.log("✅ LocalStorage updated");
      return updated;
    } catch (err) {
      const msg = err?.message || "Failed to update preferences";
      console.log("❌ Update error:", msg);
      return rejectWithValue(msg);
    }
  }
);

// Get complete profile data for dashboard
export const getCompleteProfileData = createAsyncThunk(
  "cleanerProfile/getComplete",
  async (_, { getState }) => {
    const state = getState().cleanerProfile;
    
    // Combine backend and localStorage data
    const completeProfile = {
      // Backend User data
      email: state.user?.email,
      name: state.user?.name,
      gender: state.user?.gender,
      phone_number: state.user?.phone_number,
      address: state.user?.address,
      profile_picture: state.user?.profile_picture,
      
      // Backend Cleaner data
      portfolio: state.portfolio,
      years_of_experience: state.years_of_experience,
      dbs_check: state.dbs_check,
      insurance_details: state.insurance_details,
      availibility_status: state.availibility_status,
      clean_level: state.clean_level,
      
      // LocalStorage data
      ...state.localData,
    };
    
    console.log("Complete profile data:", completeProfile);
    return completeProfile;
  }
);

// Upload avatar (existing)
export const uploadAvatar = createAsyncThunk(
  "cleanerProfile/uploadAvatar",
  async (_, { getState, rejectWithValue }) => {
    const f = getState().cleanerProfile.avatarFile;
    if (!f) return rejectWithValue("No file selected");
    try {
      console.log("→ PATCH /auth/users/me/ (multipart) profile_picture:", f?.name);
      const { data } = await uploadUserAvatar(f);
      console.log("✅ Avatar uploaded");
      toast.success("Photo uploaded successfully");
      return data;
    } catch (err) {
      const msg = err?.response?.data?.profile_picture?.[0] || err?.response?.data?.detail || "Failed to upload photo";
      console.log("❌ Upload error:", msg);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Delete avatar (existing)
export const deleteAvatar = createAsyncThunk(
  "cleanerProfile/deleteAvatar",
  async (_, { rejectWithValue }) => {
    try {
      console.log("→ PATCH /auth/users/me/ { profile_picture: null }");
      const { data } = await patchCurrentUser({ profile_picture: null });
      console.log("✅ Avatar deleted");
      toast.success("Photo removed successfully");
      return data;
    } catch (err) {
      const msg = err?.response?.data?.detail || "Failed to remove photo";
      console.log("❌ Delete error:", msg);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

/** ---------- slice ---------- */
const sl = createSlice({
  name: "cleanerProfile",
  initialState,
  reducers: {
    // Set any field in the state
    setCleanerField(state, { payload }) {
      console.log("setCleanerField", payload);
      const { path, value } = payload || {};
      if (!path) return;
      if (path.startsWith("user.")) {
        const key = path.slice(5);
        state.user = { ...state.user, [key]: value };
      } else if (path.startsWith("localData.")) {
        const key = path.slice(10);
        state.localData = { ...state.localData, [key]: value };
      } else {
        state[path] = value;
      }
    },
    
    // Set multiple local fields at once
    setLocalFields(state, { payload }) {
      console.log("setLocalFields", payload);
      state.localData = { ...state.localData, ...payload };
    },
    
    // Avatar management
    setAvatarFile(state, { payload }) {
      console.log("setAvatarFile", payload?.name);
      state.avatarFile = payload || null;
    },
    resetAvatarFile(state) {
      state.avatarFile = null;
    },
    
    // Clear all data
    resetCleanerProfile() {
      return initialState;
    },
  },
  extraReducers: (b) => {
    // LOAD COMPLETE PROFILE
    b.addCase(loadCompleteCleanerProfile.pending, (s) => {
      s.status = "loading";
      s.error = null;
    });
    b.addCase(loadCompleteCleanerProfile.fulfilled, (s, a) => {
      s.status = "succeeded";
      const { backend, local } = a.payload || {};
      
      // Set backend data
      if (backend) {
        s.user = {
          email: backend?.user?.email || "",
          name: backend?.user?.name || "",
          gender: backend?.user?.gender || "",
          phone_number: backend?.user?.phone_number || "",
          address: backend?.user?.address || "",
          profile_picture: backend?.user?.profile_picture || backend?.profile_picture || null,  // ✅ Check both paths
        };
        s.portfolio = backend?.bio || "";
        s.years_of_experience = backend?.years_of_experience ?? 0;
        s.dbs_check = !!backend?.dbs_check;
        s.insurance_details = backend?.insurance_details || "";
        s.availibility_status = !!backend?.availibility_status;
        s.clean_level = backend?.clean_level ?? 0;
      }
      
      // Set localStorage data
      if (local) {
        s.localData = { ...s.localData, ...local };
      }
      
      s.localDataLoaded = true;
      console.log("Profile loaded successfully");
    });
    b.addCase(loadCompleteCleanerProfile.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.payload || a.error?.message;
    });

    // SAVE COMPLETE PROFILE
    b.addCase(saveCompleteCleanerProfile.pending, (s) => {
      s.status = "saving";
      s.error = null;
    });
    b.addCase(saveCompleteCleanerProfile.fulfilled, (s, a) => {
      s.status = "succeeded";
      const { backend, local } = a.payload || {};
      
      // Update backend data
      if (backend) {
        s.user = {
          email: backend?.user?.email || s.user.email,
          name: backend?.user?.name || s.user.name,
          gender: backend?.user?.gender || s.user.gender,
          phone_number: backend?.user?.phone_number || s.user.phone_number,
          address: backend?.user?.address || s.user.address,
          profile_picture: backend?.user?.profile_picture || s.user.profile_picture,
        };
        s.portfolio = backend?.portfolio || "";
        s.years_of_experience = backend?.years_of_experience ?? 0;
        s.dbs_check = !!backend?.dbs_check;
        s.insurance_details = backend?.insurance_details || "";
        s.availibility_status = !!backend?.availibility_status;
        s.clean_level = backend?.clean_level ?? 0;
      }
      
      // Update localStorage data
      if (local) {
        s.localData = { ...s.localData, ...local };
      }
      
      toast.success("Profile saved successfully!");
    });
    b.addCase(saveCompleteCleanerProfile.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.payload || a.error?.message;
      toast.error(s.error || "Failed to save profile");
    });

    // UPDATE LOCAL STORAGE FIELDS
    b.addCase(updateLocalStorageFields.fulfilled, (s, a) => {
      s.localData = { ...s.localData, ...a.payload };
      toast.success("Preferences updated!");
    });
    b.addCase(updateLocalStorageFields.rejected, (s, a) => {
      toast.error(a.payload || "Failed to update preferences");
    });

    // UPLOAD AVATAR (existing cases)
    b.addCase(uploadAvatar.pending, (s) => {
      s.avatarUploading = true;
      s.error = null;
    });
    b.addCase(uploadAvatar.fulfilled, (s, a) => {
      s.avatarUploading = false;
      const user = a.payload || {};
      s.user = { ...s.user, profile_picture: user?.profile_picture || s.user.profile_picture };
      s.avatarFile = null;
    });
    b.addCase(uploadAvatar.rejected, (s, a) => {
      s.avatarUploading = false;
      s.error = a.payload || a.error?.message;
    });

    // DELETE AVATAR (existing cases)
    b.addCase(deleteAvatar.pending, (s) => {
      s.avatarUploading = true;
      s.error = null;
    });
    b.addCase(deleteAvatar.fulfilled, (s, a) => {
      s.avatarUploading = false;
      const user = a.payload || {};
      s.user = { ...s.user, profile_picture: user?.profile_picture || null };
      s.avatarFile = null;
    });
    b.addCase(deleteAvatar.rejected, (s, a) => {
      s.avatarUploading = false;
      s.error = a.payload || a.error?.message;
    });
  },
});

export const { 
  setCleanerField, 
  setLocalFields, 
  setAvatarFile, 
  resetAvatarFile,
  resetCleanerProfile 
} = sl.actions;

export const selectCleanerProfile = (s) => s.cleanerProfile;
export const selectCompleteProfile = (s) => ({
  ...s.cleanerProfile.user,
  portfolio: s.cleanerProfile.portfolio,
  years_of_experience: s.cleanerProfile.years_of_experience,
  dbs_check: s.cleanerProfile.dbs_check,
  insurance_details: s.cleanerProfile.insurance_details,
  availibility_status: s.cleanerProfile.availibility_status,
  clean_level: s.cleanerProfile.clean_level,
  ...s.cleanerProfile.localData,
});

export default sl.reducer;
