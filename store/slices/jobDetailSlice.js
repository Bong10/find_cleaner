// @/store/slices/jobDetailSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getJob, updateJob } from "@/services/jobsService";

export const fetchJobDetail = createAsyncThunk(
  "jobDetail/fetchJobDetail",
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await getJob(jobId);
      return data;
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to load job";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const saveJobChanges = createAsyncThunk(
  "jobDetail/saveJobChanges",
  async ({ jobId, payload }, { rejectWithValue }) => {
    try {
      const { data } = await updateJob(jobId, payload);
      toast.success("Job updated");
      return data;
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === "object") {
        Object.entries(data).forEach(([field, msgs]) => {
          const m = Array.isArray(msgs) ? msgs[0] : String(msgs);
          toast.error(`${field}: ${m}`);
        });
        return rejectWithValue(data);
      }
      const msg = err?.message || "Failed to update job";
      toast.error(msg);
      return rejectWithValue({ detail: msg });
    }
  }
);

const jobDetailSlice = createSlice({
  name: "jobDetail",
  initialState: {
    job: null,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchJobDetail.pending, (s) => {
      s.loading = true; s.error = null;
    });
    b.addCase(fetchJobDetail.fulfilled, (s, a) => {
      s.loading = false; s.job = a.payload;
    });
    b.addCase(fetchJobDetail.rejected, (s, a) => {
      s.loading = false; s.error = a.payload || a.error?.message;
    });

    b.addCase(saveJobChanges.pending, (s) => {
      s.saving = true;
    });
    b.addCase(saveJobChanges.fulfilled, (s, a) => {
      s.saving = false; s.job = a.payload;
    });
    b.addCase(saveJobChanges.rejected, (s) => {
      s.saving = false;
    });
  },
});

export const selectJobDetail = (state) => state.jobDetail;
export default jobDetailSlice.reducer;
