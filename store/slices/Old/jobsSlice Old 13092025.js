// store/slices/jobsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createJob } from "@/services/jobsService";
import { toast } from "react-toastify";

const initialState = {
  form: {
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    hourly_rate: "",
    hours_required: 1,
    services: [], // array of IDs
  },
  submitting: false,
  error: null,
  created: null, // server response for last created job
};

export const submitJob = createAsyncThunk(
  "jobs/submit",
  async (_, { getState, rejectWithValue }) => {
    const { jobs } = getState();
    const f = jobs.form;

    // Basic client-side guardrails (DRF still validates)
    if (!f.title?.trim()) return rejectWithValue({ title: ["Title is required."] });
    if (!f.description?.trim()) return rejectWithValue({ description: ["Description is required."] });
    if (!f.location?.trim()) return rejectWithValue({ location: ["Location is required."] });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f.date)) return rejectWithValue({ date: ["Date must be YYYY-MM-DD."] });
    if (!/^\d{2}:\d{2}$/.test(f.time)) return rejectWithValue({ time: ["Time must be HH:MM."] });
    if (!Array.isArray(f.services) || f.services.length === 0)
      return rejectWithValue({ services: ["Select at least one service."] });

    const payload = {
      title: f.title.trim(),
      description: f.description.trim(),
      location: f.location.trim(),
      date: f.date,
      time: f.time,
      hourly_rate: f.hourly_rate === "" ? 0 : Number(f.hourly_rate),
      hours_required: Number(f.hours_required) || 1,
      services: f.services,
    };

    try {
      const data = await createJob(payload);
      return data;
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === "object") {
        // Show each field error
        Object.entries(data).forEach(([field, msgs]) => {
          const msg = Array.isArray(msgs) ? msgs[0] : String(msgs);
          toast.error(`${field}: ${msg}`);
        });
        return rejectWithValue(data);
      }
      const msg = err?.message || "Failed to post job";
      toast.error(msg);
      return rejectWithValue({ detail: msg });
    }
  }
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    updateJobField: (state, action) => {
      const { name, value } = action.payload || {};
      if (name in state.form) state.form[name] = value;
    },
    setJobServices: (state, action) => {
      state.form.services = action.payload || [];
    },
    resetJobForm: (state) => {
      state.form = { ...initialState.form };
      state.error = null;
      state.created = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitJob.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.created = null;
      })
      .addCase(submitJob.fulfilled, (state, action) => {
        state.submitting = false;
        state.created = action.payload;
        // optional: keep fields? here we reset
        state.form = { ...initialState.form };
        toast.success("Job posted successfully");
      })
      .addCase(submitJob.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || { detail: "Failed to post job" };
        if (state.error?.detail) toast.error(state.error.detail);
      });
  },
});

export const { updateJobField, setJobServices, resetJobForm } = jobsSlice.actions;
export const selectJobForm = (state) => state.jobs.form;
export const selectJobSubmitting = (state) => state.jobs.submitting;
export const selectJobCreated = (state) => state.jobs.created;
export default jobsSlice.reducer;
