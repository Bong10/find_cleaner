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

  // Backend data - User model (includes address fields)
  user: {
    email: "",
    name: "",
    gender: "",
    phone_number: "",
    profile_picture: null,
    date_of_birth: "",
    address_line1: "",
    address_line2: "",
    city: "",
    county: "",
    postcode: "",
    country: "United Kingdom",
  },

  // Backend data - Cleaner model (includes all service preferences)
  portfolio: "",
  years_of_experience: "",
  dbs_check: false,
  // availibility_status: calculated from availability on backend
  minimum_hours: 1,
  availability: {},
  service_types: [],
  service_areas: [],
  dbs_certificate_number: "",
  
  // Verification documents (backend)
  id_document_front: null,
  id_document_back: null,
  cv: null,
  
  // References (backend)
  references: [],

  // DEPRECATED: LocalStorage no longer used for critical data
  // All data now saved to backend for persistence and admin verification
  localData: {},

  // UI state
  avatarFile: null,
  avatarUploading: false,
  localDataLoaded: false,
};

/** ---------- Helper functions ---------- */

// Load all localStorage data for cleaner
const loadLocalStorageData = () => {
  // LocalStorage is disabled as per requirement
  return {};
};

// Save to localStorage
const saveToLocalStorage = (data) => {
  // LocalStorage is disabled as per requirement
  return data;
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
      // console.log("✅ LocalStorage data loaded:", localData);
      
      return {
        backend: backendData,
        local: localData
      };
    } catch (err) {
      const msg = err?.response?.data?.errormessage || err?.response?.data?.detail || err?.message || "Failed to load profile";
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
      
      // Helper function to convert experience string to integer
      const convertExperienceToInt = (experienceStr) => {
        if (!experienceStr) return 0;
        if (typeof experienceStr === 'number') return experienceStr;
        
        // Map string values to integers (midpoint of range)
        const experienceMap = {
          "Less than 1": 0,
          "1-2": 1,
          "3-5": 4,
          "5-10": 7,
          "10+": 10
        };
        
        return experienceMap[experienceStr] || 0;
      };
      
      // ========== STEP 1: Save User Model Fields ==========
      // Only name, gender, phone_number belong to User model
      const userPayload = {
        name: formData.name || state.user?.name || "",
        gender: formData.gender || state.user?.gender || "",
        phone_number: formData.phone_number || state.user?.phone_number || "",
      };

      console.log("\ud83d\udce4 [ONBOARDING] Saving USER data to backend:", userPayload);
      await patchCurrentUser(userPayload);
      console.log("\u2705 [ONBOARDING] User data saved successfully");
      
      // ========== STEP 2: Upload Profile Picture ==========
      if (formData.profile_picture instanceof File) {
        try {
          log("→ Uploading profile picture:", formData.profile_picture.name);
          const picFormData = new FormData();
          picFormData.append('profile_picture', formData.profile_picture);
          await patchCurrentUserMultipart(picFormData);
          log("✅ Profile picture uploaded successfully");
        } catch (error) {
          log("❌ Profile picture upload failed:", error.response?.data || error.message);
          console.error("Profile picture upload error:", error);
        }
      }
      
      // ========== STEP 3: Prepare Complete Cleaner Data with Files & References ==========
      const cleanerFormData = new FormData();
      
      // Personal info (belongs to Cleaner model)
      if (formData.date_of_birth || state.localData.date_of_birth) {
        cleanerFormData.append('date_of_birth', formData.date_of_birth || state.localData.date_of_birth);
      }
      
      // Address fields (belong to Cleaner model)
      if (formData.address_line1 || state.localData.address_line1) {
        cleanerFormData.append('address_line1', formData.address_line1 || state.localData.address_line1);
      }
      if (formData.address_line2 || state.localData.address_line2) {
        cleanerFormData.append('address_line2', formData.address_line2 || state.localData.address_line2);
      }
      if (formData.city || state.localData.city) {
        cleanerFormData.append('city', formData.city || state.localData.city);
      }
      if (formData.county || state.localData.county) {
        cleanerFormData.append('county', formData.county || state.localData.county);
      }
      if (formData.postcode || state.localData.postcode) {
        cleanerFormData.append('postcode', formData.postcode || state.localData.postcode);
      }
      cleanerFormData.append('country', formData.country || state.localData.country || "United Kingdom");
      
      // Basic cleaner fields
      cleanerFormData.append('portfolio', formData.bio || state.portfolio || "");
      cleanerFormData.append('years_of_experience', convertExperienceToInt(formData.years_of_experience || state.years_of_experience));
      cleanerFormData.append('dbs_check', formData.dbs_check !== undefined ? formData.dbs_check : state.dbs_check);
      // Note: availibility_status is calculated from availability field on backend
      
      // Service preferences (now sent to backend!)
      cleanerFormData.append('minimum_hours', formData.minimum_hours || state.localData.minimum_hours || 1);
      
      if (formData.availability || state.localData.availability) {
        cleanerFormData.append('availability', JSON.stringify(formData.availability || state.localData.availability));
      }
      
      if (formData.service_areas || state.localData.service_areas) {
        cleanerFormData.append('service_areas', JSON.stringify(formData.service_areas || state.localData.service_areas));
      }
      
      if (formData.service_types || state.localData.service_types) {
        cleanerFormData.append('service_types', JSON.stringify(formData.service_types || state.localData.service_types));
      }
      
      // DBS certificate number
      if (formData.dbs_certificate_number) {
        cleanerFormData.append('dbs_certificate_number', formData.dbs_certificate_number);
      }
      
      // ========== STEP 4: Upload Verification Documents (Previously LOST!) ==========
      if (formData.id_document_front instanceof File) {
        cleanerFormData.append('id_document_front', formData.id_document_front);
        log("→ Adding ID Front document:", formData.id_document_front.name);
      }
      
      if (formData.id_document_back instanceof File) {
        cleanerFormData.append('id_document_back', formData.id_document_back);
        log("→ Adding ID Back document:", formData.id_document_back.name);
      }
      
      if (formData.cv instanceof File) {
        cleanerFormData.append('cv', formData.cv);
        log("→ Adding CV:", formData.cv.name);
      }
      
      // ========== STEP 5: Prepare References (Previously LOST!) ==========
      const references = [];
      
      // Professional Reference
      if (formData.professional_ref_name && formData.professional_ref_email) {
        references.push({
          reference_type: 'professional',
          name: formData.professional_ref_name,
          relationship: formData.professional_ref_relationship || '',
          email: formData.professional_ref_email,
          phone: formData.professional_ref_phone || ''
        });
        log("→ Adding professional reference:", formData.professional_ref_name);
      }
      
      // Character Reference
      if (formData.character_ref_name && formData.character_ref_email) {
        references.push({
          reference_type: 'character',
          name: formData.character_ref_name,
          relationship: formData.character_ref_relationship || '',
          email: formData.character_ref_email,
          phone: formData.character_ref_phone || ''
        });
        log("→ Adding character reference:", formData.character_ref_name);
      }
      
      if (references.length > 0) {
        cleanerFormData.append('references', JSON.stringify(references));
      }
      
      // Log detailed cleaner data being sent (show file info instead of actual files)
      const cleanerDataLog = {
        date_of_birth: formData.date_of_birth || state.localData.date_of_birth || "",
        address_line1: formData.address_line1 || state.localData.address_line1 || "",
        address_line2: formData.address_line2 || state.localData.address_line2 || "",
        city: formData.city || state.localData.city || "",
        county: formData.county || state.localData.county || "",
        postcode: formData.postcode || state.localData.postcode || "",
        country: formData.country || state.localData.country || "United Kingdom",
        portfolio: formData.bio || state.portfolio || "",
        years_of_experience: convertExperienceToInt(formData.years_of_experience || state.years_of_experience),
        dbs_check: formData.dbs_check !== undefined ? formData.dbs_check : state.dbs_check,
        dbs_certificate_number: formData.dbs_certificate_number || state.localData.dbs_certificate_number || "",
        availibility_status: formData.availibility_status !== undefined ? formData.availibility_status : state.availibility_status,
        minimum_hours: formData.minimum_hours || state.localData.minimum_hours || 1,
        service_types: formData.service_types || state.localData.service_types || [],
        availability: formData.availability || state.localData.availability || {},
        service_areas: formData.service_areas || state.localData.service_areas || [],
        references: references,
        files: {
          id_document_front: formData.id_document_front instanceof File ? {
            name: formData.id_document_front.name,
            size: formData.id_document_front.size,
            type: formData.id_document_front.type
          } : null,
          id_document_back: formData.id_document_back instanceof File ? {
            name: formData.id_document_back.name,
            size: formData.id_document_back.size,
            type: formData.id_document_back.type
          } : null,
          cv: formData.cv instanceof File ? {
            name: formData.cv.name,
            size: formData.cv.size,
            type: formData.cv.type
          } : null,
        },
      };
      
      // ========== STEP 6: Send Everything to Backend ==========
      console.log("\ud83d\udce4 [ONBOARDING] Saving CLEANER data to backend:", cleanerDataLog);
      await patchCleanerMe(cleanerFormData);
      console.log("\u2705 [ONBOARDING] Cleaner data saved successfully");
      
      // ========== STEP 7: Reload Profile from Backend ==========
      console.log("→ Reloading complete profile...");
      const { data: reloadedData } = await getCleanerMe();
      
      console.log("✅ Complete save successful - All 30 fields saved to backend!");
      console.log("✅ Documents uploaded: ID Front, ID Back, CV");
      console.log("✅ References saved:", references.length);
      console.log("✅ Service preferences saved to backend (no longer in localStorage)");
      
      return {
        backend: reloadedData,
        local: {} // No longer using localStorage for critical data
      };
    } catch (err) {
      console.log("❌ Save error:", err);
      // Pass the full error structure so the UI can handle field-specific errors
      if (err.response && err.response.data) {
        return rejectWithValue({ response: { data: err.response.data } });
      }
      return rejectWithValue({ message: err.message || "Failed to save profile" });
    }
  }
);

// Update only localStorage fields
export const updateLocalStorageFields = createAsyncThunk(
  "cleanerProfile/updateLocal",
  async (fields, { rejectWithValue }) => {
    try {
      console.log("→ Updating localStorage fields (DISABLED):", fields);
      // const updated = saveToLocalStorage(fields);
      // console.log("✅ LocalStorage updated");
      return fields;
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
      // availibility_status: calculated from availability on backend
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
          profile_picture: backend?.user?.profile_picture || backend?.profile_picture || null,
          // Map Cleaner model fields to user state for UI consistency
          date_of_birth: backend?.date_of_birth || "",
          address_line1: backend?.address_line1 || "",
          address_line2: backend?.address_line2 || "",
          city: backend?.city || "",
          county: backend?.county || "",
          postcode: backend?.postcode || "",
          country: backend?.country || "United Kingdom",
        };
        s.portfolio = backend?.bio || "";
        s.years_of_experience = backend?.years_of_experience ?? 0;
        s.dbs_check = !!backend?.dbs_check;
        s.insurance_details = backend?.insurance_details || "";
        // s.availibility_status calculated from availability on backend
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
        // s.availibility_status calculated from availability on backend
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
      
      // Handle structured error object from rejectWithValue
      if (a.payload?.response?.data) {
        s.error = "Validation failed";
        // We don't toast here because the component handles specific field errors
      } else {
        s.error = typeof a.payload === 'string' ? a.payload : (a.error?.message || "Failed to save profile");
        toast.error(s.error);
      }
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
  // availibility_status: calculated from availability on backend
  clean_level: s.cleanerProfile.clean_level,
  ...s.cleanerProfile.localData,
});

export default sl.reducer;
