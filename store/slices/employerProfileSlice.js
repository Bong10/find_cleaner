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
      
      // LOGGING FOR DEBUGGING
      console.log("=== EMPLOYER PROFILE FETCHED ===");
      console.log("User Data:", uRes.data);
      console.log("Employer Data:", eRes.data);
      console.log("================================");

      return { user: uRes.data, employer: eRes.data };
    } catch (err) {
      const detail =
        err?.response?.data?.errormessage ||
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to load profile";
      toast.error(detail);
      return rejectWithValue(detail);
    }
  }
);

// ---------- SAVE (text fields only) ----------
export const saveEmployerProfile = createAsyncThunk(
  "employerProfile/save",
  async (formValues, { rejectWithValue, getState }) => {
    try {
      // PARTIAL UPDATE STRATEGY:
      // Only send fields that are present in formValues.
      // This prevents validation errors from unrelated sections.

      const {
        first_name, last_name, phone_number, gender, address, business_name,
      } = formValues;

      // 1. Update User (only if relevant fields are present)
      const userPayload = {};
      if (first_name !== undefined || last_name !== undefined) {
        // We need both to construct name, so we might need to grab the missing one from state if only one is edited
        // But usually they are edited together in FormInfoBox.
        // If they are separate, we should grab from state.
        const state = getState().employerProfile;
        const fName = first_name !== undefined ? first_name : state.first_name;
        const lName = last_name !== undefined ? last_name : state.last_name;
        userPayload.name = mergeName(fName, lName);
      }
      if (phone_number !== undefined) userPayload.phone_number = phone_number || null;
      if (gender !== undefined) userPayload.gender = gender || null;
      if (address !== undefined) userPayload.address = address || "";

      if (Object.keys(userPayload).length > 0) {
        await patchCurrentUser(userPayload);
      }

      // 2. Update Employer (only if relevant fields are present)
      const employerPayload = {};
      
      if (business_name !== undefined) employerPayload.business_name = business_name;
      if (address !== undefined) employerPayload.location = address; // Mirror address to location
      
      if (formValues.property_type !== undefined) employerPayload.property_type = formValues.property_type;
      if (formValues.bedrooms !== undefined) employerPayload.bedrooms = Number(formValues.bedrooms) || 0;
      if (formValues.bathrooms !== undefined) employerPayload.bathrooms = Number(formValues.bathrooms) || 0;
      if (formValues.toilets !== undefined) employerPayload.toilets = Number(formValues.toilets) || 0;
      if (formValues.kitchens !== undefined) employerPayload.kitchens = Number(formValues.kitchens) || 0;
      if (formValues.rooms !== undefined) employerPayload.rooms = Number(formValues.rooms) || 0;
      
      if (formValues.cleaning_frequency !== undefined) employerPayload.cleaning_frequency = formValues.cleaning_frequency;
      if (formValues.preferred_time_of_day !== undefined) employerPayload.preferred_time = formValues.preferred_time_of_day;
      if (formValues.cleaning_priorities !== undefined) employerPayload.cleaning_priorities = formValues.cleaning_priorities;
      
      if (formValues.has_pets !== undefined) employerPayload.pets_in_property = formValues.has_pets;
      
      if (formValues.supplies_provided !== undefined) {
        // Map "yes"/"no" to boolean
        employerPayload.cleaning_supplies = formValues.supplies_provided === 'yes';
      }
      
      if (formValues.parking_available !== undefined) employerPayload.parking_available = formValues.parking_available;
      if (formValues.elevator_access !== undefined) employerPayload.elevator_access = formValues.elevator_access;
      if (formValues.access_instructions !== undefined) employerPayload.access_instructions = formValues.access_instructions;
      if (formValues.special_requirements !== undefined) employerPayload.special_requirements = formValues.special_requirements;

      let eRes = { data: {} };
      if (Object.keys(employerPayload).length > 0) {
        eRes = await patchEmployerMe(employerPayload);
      }

      toast.success("Profile saved");
      
      // LOGGING FOR DEBUGGING
      console.log("=== EMPLOYER PROFILE SAVED (PARTIAL) ===");
      console.log("Sent User Payload:", userPayload);
      console.log("Sent Employer Payload:", employerPayload);
      console.log("Backend Response:", eRes.data);
      console.log("========================================");

      return { employer: eRes.data };
    } catch (err) {
      const api = err?.response?.data;
      const msg =
        api?.errormessage ||
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
        err?.response?.data?.errormessage ||
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
        err?.response?.data?.errormessage ||
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
  
  // New Fields
  property_type: "",
  bedrooms: 0,
  bathrooms: 0,
  toilets: 0,
  kitchens: 0,
  rooms: 0,
  cleaning_frequency: "",
  preferred_time_of_day: "",
  cleaning_priorities: [],
  has_pets: false,
  parking_available: false,
  elevator_access: false,
  supplies_provided: "",
  access_instructions: "",
  special_requirements: "",

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

      // Map new fields
      state.property_type = employer?.property_type || "";
      state.bedrooms = employer?.bedrooms || 0;
      state.bathrooms = employer?.bathrooms || 0;
      state.toilets = employer?.toilets || 0;
      state.kitchens = employer?.kitchens || 0;
      state.rooms = employer?.rooms || 0;
      state.cleaning_frequency = employer?.cleaning_frequency || "";
      
      // Map backend fields to frontend state
      state.preferred_time_of_day = employer?.preferred_time || employer?.preferred_time_of_day || "";
      state.cleaning_priorities = employer?.cleaning_priorities || [];
      state.has_pets = employer?.pets_in_property !== undefined ? employer.pets_in_property : (employer?.has_pets || false);
      
      // Map boolean cleaning_supplies to string options
      let supplies = "";
      if (employer?.cleaning_supplies === true) supplies = "yes";
      else if (employer?.cleaning_supplies === false) supplies = "no";
      else if (employer?.cleaning_supplies === null) supplies = "either";
      state.supplies_provided = supplies || employer?.supplies_provided || "";
      
      state.parking_available = employer?.parking_available || false;
      state.elevator_access = employer?.elevator_access || false;
      state.access_instructions = employer?.access_instructions || "";
      state.special_requirements = employer?.special_requirements || "";

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

      // Update state with saved values
      // We prioritize the backend response (employer.*), but fallback to the sent values (action.meta.arg.*)
      // if the backend doesn't return the field (or returns null/empty), and finally fallback to current state.
      const sent = action.meta.arg || {};

      state.property_type = employer?.property_type || sent.property_type || state.property_type;
      state.bedrooms = employer?.bedrooms !== undefined ? employer.bedrooms : (sent.bedrooms !== undefined ? sent.bedrooms : state.bedrooms);
      state.bathrooms = employer?.bathrooms !== undefined ? employer.bathrooms : (sent.bathrooms !== undefined ? sent.bathrooms : state.bathrooms);
      state.toilets = employer?.toilets !== undefined ? employer.toilets : (sent.toilets !== undefined ? sent.toilets : state.toilets);
      state.kitchens = employer?.kitchens !== undefined ? employer.kitchens : (sent.kitchens !== undefined ? sent.kitchens : state.kitchens);
      state.rooms = employer?.rooms !== undefined ? employer.rooms : (sent.rooms !== undefined ? sent.rooms : state.rooms);
      
      state.cleaning_frequency = employer?.cleaning_frequency || sent.cleaning_frequency || state.cleaning_frequency;
      
      // Map backend fields to frontend state (with fallback to sent values)
      state.preferred_time_of_day = employer?.preferred_time || employer?.preferred_time_of_day || sent.preferred_time_of_day || state.preferred_time_of_day;
      state.cleaning_priorities = employer?.cleaning_priorities || sent.cleaning_priorities || state.cleaning_priorities;
      
      state.has_pets = employer?.pets_in_property !== undefined ? employer.pets_in_property : (employer?.has_pets !== undefined ? employer.has_pets : (sent.has_pets !== undefined ? sent.has_pets : state.has_pets));
      
      state.parking_available = employer?.parking_available !== undefined ? employer.parking_available : (sent.parking_available !== undefined ? sent.parking_available : state.parking_available);
      state.elevator_access = employer?.elevator_access !== undefined ? employer.elevator_access : (sent.elevator_access !== undefined ? sent.elevator_access : state.elevator_access);
      
      // Map boolean cleaning_supplies to string options
      let supplies = "";
      if (employer?.cleaning_supplies === true) supplies = "yes";
      else if (employer?.cleaning_supplies === false) supplies = "no";
      
      state.supplies_provided = supplies || employer?.supplies_provided || sent.supplies_provided || state.supplies_provided;
      
      state.access_instructions = employer?.access_instructions || sent.access_instructions || state.access_instructions;
      state.special_requirements = employer?.special_requirements || sent.special_requirements || state.special_requirements;

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
