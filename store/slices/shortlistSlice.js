// store/slices/shortlistSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  listShortlist,
  createShortlist,
  deleteShortlist,
} from "@/services/jobsService";

const initialState = {
  items: [],            // [{ id, job, job_title, cleaner, cleaner_name, created_at }]
  status: "idle",
  error: null,
  query: "",
  removingIds: {},      // compatibility with components using removingIds
  acting: {},           // mirror of removingIds (either can be used)
};

/* Load shortlist */
export const loadShortlist = createAsyncThunk(
  "shortlist/loadShortlist",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await listShortlist();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to load shortlist";
      return rejectWithValue(msg);
    }
  }
);
// alias so older imports don't break
export const fetchShortlist = loadShortlist;

/* Add to shortlist (optional button support) */
export const addToShortlist = createAsyncThunk(
  "shortlist/addToShortlist",
  async ({ job, cleaner }, { rejectWithValue }) => {
    try {
      const { data } = await createShortlist({ job, cleaner });
      return data; // should contain {id, job, cleaner, ...}
    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to add to shortlist";
      return rejectWithValue(detail);
    }
  }
);

/* Remove by shortlist row id */
export const removeFromShortlist = createAsyncThunk(
  "shortlist/removeFromShortlist",
  async ({ id }, { rejectWithValue }) => {
    if (id == null) return rejectWithValue("Missing shortlist id");
    try {
      await deleteShortlist(id);
      return id;
    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to remove from shortlist";
      return rejectWithValue(detail);
    }
  }
);
// alias so older imports don't break
export const removeShortlisted = removeFromShortlist;

const shortlistSlice = createSlice({
  name: "shortlist",
  initialState,
  reducers: {
    setShortlistQuery(state, action) {
      state.query = action.payload || "";
    },
  },
  extraReducers: (b) => {
    /* load */
    b.addCase(loadShortlist.pending, (s) => {
      s.status = "loading";
      s.error = null;
    });
    b.addCase(loadShortlist.fulfilled, (s, a) => {
      s.status = "succeeded";
      s.items = a.payload || [];
    });
    b.addCase(loadShortlist.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.payload || a.error?.message || "Failed to load shortlist";
      toast.error(s.error);
    });

    /* add */
    b.addCase(addToShortlist.fulfilled, (s, a) => {
      const row = a.payload;
      if (row && row.id != null && !s.items.some((r) => r.id === row.id)) {
        s.items.unshift(row);
      }
      toast.success("Added to shortlist");
    });
    b.addCase(addToShortlist.rejected, (s, a) => {
      const msg = a.payload || a.error?.message || "Failed to add to shortlist";
      toast.error(msg);
    });

    /* remove */
    b.addCase(removeFromShortlist.pending, (s, a) => {
      const id = a.meta.arg?.id;
      if (id != null) {
        s.removingIds[id] = true;
        s.acting[id] = true; // mirror
      }
    });
    b.addCase(removeFromShortlist.fulfilled, (s, a) => {
      const id = a.payload;
      delete s.removingIds[id];
      delete s.acting[id];
      s.items = s.items.filter((row) => row.id !== id);
      toast.success("Removed from shortlist");
    });
    b.addCase(removeFromShortlist.rejected, (s, a) => {
      const id = a.meta.arg?.id;
      if (id != null) {
        delete s.removingIds[id];
        delete s.acting[id];
      }
      const msg = a.payload || a.error?.message || "Failed to remove from shortlist";
      toast.error(msg);
    });
  },
});

export const { setShortlistQuery } = shortlistSlice.actions;

/* Selectors */
export const selectShortlist = (s) => s.shortlist || initialState;

// Find a row by cleaner/job combo (works if component calls with either)
export const selectShortlistByKey = (state, cleanerId, jobId) => {
  const { items = [] } = selectShortlist(state);
  if (cleanerId == null && jobId == null) return null;
  return (
    items.find(
      (r) =>
        (cleanerId == null || Number(r.cleaner) === Number(cleanerId)) &&
        (jobId == null || Number(r.job) === Number(jobId))
    ) || null
  );
};

// convenience
export const selectShortlistByCleaner = (state, cleanerId) => {
  const { items = [] } = selectShortlist(state);
  return items.filter((r) => Number(r.cleaner) === Number(cleanerId));
};

export default shortlistSlice.reducer;
