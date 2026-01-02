// @/store/slices/allApplicantsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  listAllApplicants,
  acceptApplication,
  rejectApplication,
  // optional shortlist endpoints if you added them:
  listShortlist,
  createShortlist,
  deleteShortlist,
} from "@/services/jobsService";
import { toast } from "react-toastify";

const initialState = {
  items: [],            // flat array of applications (employer-scoped)
  status: "idle",
  error: null,
  tab: "all",           // "all" | "p" | "a" | "r"
  query: "",
  acting: {},           // { [applicationId]: true }
  // shortlist (optional; safe to leave if unused)
  shortlist: {
    status: "idle",
    items: [],          // [{ id, job, cleaner }]
    map: {},            // {"<jobId>:<cleanerId>": { id, job, cleaner }}
    acting: {},         // {"<jobId>:<cleanerId>": true}
  },
};

// ---------------- Thunks ----------------

export const loadAllApplicants = createAsyncThunk(
  "allApplicants/load",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await listAllApplicants();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to load applicants";
      return rejectWithValue(msg);
    }
  }
);

export const acceptApplicantGlobal = createAsyncThunk(
  "allApplicants/accept",
  async ({ applicationId }, { rejectWithValue }) => {
    try {
      await acceptApplication(applicationId);
      return { applicationId };
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to accept applicant";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const rejectApplicantGlobal = createAsyncThunk(
  "allApplicants/reject",
  async ({ applicationId, reason = "" }, { rejectWithValue }) => {
    try {
      await rejectApplication(applicationId, reason);
      return { applicationId, reason };
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === "object") {
        Object.entries(data).forEach(([field, msgs]) => {
          const m = Array.isArray(msgs) ? msgs[0] : String(msgs);
          toast.error(`${field}: ${m}`);
        });
      } else {
        const msg = err?.message || "Failed to reject applicant";
        toast.error(msg);
      }
      return rejectWithValue("reject_failed");
    }
  }
);

// ------- Optional shortlist thunks (safe if unused in your page) -------
export const loadShortlist = createAsyncThunk(
  "allApplicants/loadShortlist",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await listShortlist();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to load shortlist");
    }
  }
);

export const addShortlist = createAsyncThunk(
  "allApplicants/addShortlist",
  async ({ jobId, cleanerId }, { rejectWithValue }) => {
    try {
      const { data } = await createShortlist({ job: jobId, cleaner: cleanerId });
      return data; // {id, job, cleaner}
    } catch (err) {
      return rejectWithValue(err?.response?.data || err?.message || "Failed to add shortlist");
    }
  }
);

export const removeShortlist = createAsyncThunk(
  "allApplicants/removeShortlist",
  async ({ shortlistId }, { rejectWithValue }) => {
    try {
      await deleteShortlist(shortlistId);
      return shortlistId;
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to remove shortlist");
    }
  }
);

// ---------------- Slice ----------------

const slice = createSlice({
  name: "allApplicants",
  initialState,
  reducers: {
    setApplicantsTab(state, action) {
      state.tab = action.payload; // "all" | "p" | "a" | "r"
    },
    setApplicantsQuery(state, action) {
      state.query = action.payload || "";
    },
  },
  extraReducers: (b) => {
    // loadAllApplicants
    b.addCase(loadAllApplicants.pending, (s) => {
      s.status = "loading"; s.error = null;
    });
    b.addCase(loadAllApplicants.fulfilled, (s, a) => {
      s.status = "succeeded"; s.items = a.payload || [];
    });
    b.addCase(loadAllApplicants.rejected, (s, a) => {
      s.status = "failed"; s.error = a.payload || a.error?.message || "Failed to load applicants";
      toast.error(s.error);
    });

    // accept
    b.addCase(acceptApplicantGlobal.pending, (s, a) => {
      s.acting[a.meta.arg.applicationId] = true;
    });
    b.addCase(acceptApplicantGlobal.fulfilled, (s, a) => {
      const id = a.payload.applicationId;
      delete s.acting[id];
      const item = s.items.find((x) => x.application_id === id);
      if (item) item.status = "a";
      toast.success("Applicant accepted");
    });
    b.addCase(acceptApplicantGlobal.rejected, (s, a) => {
      const id = a.meta.arg.applicationId;
      delete s.acting[id];
    });

    // reject
    b.addCase(rejectApplicantGlobal.pending, (s, a) => {
      s.acting[a.meta.arg.applicationId] = true;
    });
    b.addCase(rejectApplicantGlobal.fulfilled, (s, a) => {
      const id = a.payload.applicationId;
      delete s.acting[id];
      const item = s.items.find((x) => x.application_id === id);
      if (item) {
        item.status = "r";
        item.rejection_reason = a.payload.reason || "";
      }
      toast.success("Applicant rejected");
    });
    b.addCase(rejectApplicantGlobal.rejected, (s, a) => {
      const id = a.meta.arg.applicationId;
      delete s.acting[id];
    });

    // ------- shortlist (optional) -------
    b.addCase(loadShortlist.pending, (s) => {
      s.shortlist.status = "loading";
    });
    b.addCase(loadShortlist.fulfilled, (s, a) => {
      s.shortlist.status = "succeeded";
      s.shortlist.items = a.payload || [];
      const map = {};
      s.shortlist.items.forEach((sl) => {
        map[`${sl.job}:${sl.cleaner}`] = sl;
      });
      s.shortlist.map = map;
    });
    b.addCase(loadShortlist.rejected, (s) => {
      s.shortlist.status = "failed";
    });

    b.addCase(addShortlist.pending, (s, a) => {
      const { jobId, cleanerId } = a.meta.arg;
      s.shortlist.acting[`${jobId}:${cleanerId}`] = true;
    });
    b.addCase(addShortlist.fulfilled, (s, a) => {
      const sl = a.payload; // { id, job, cleaner }
      delete s.shortlist.acting[`${sl.job}:${sl.cleaner}`];
      s.shortlist.items.push(sl);
      s.shortlist.map[`${sl.job}:${sl.cleaner}`] = sl;
      toast.success("Added to shortlist");
    });
    b.addCase(addShortlist.rejected, (s, a) => {
      const { jobId, cleanerId } = a.meta.arg;
      delete s.shortlist.acting[`${jobId}:${cleanerId}`];
      toast.error(
        typeof a.payload === "string"
          ? a.payload
          : "Failed to add shortlist"
      );
    });

    b.addCase(removeShortlist.pending, (s, a) => {
      const { shortlistId } = a.meta.arg;
      // mark all keys matching that id (rarely needed, kept simple)
      Object.keys(s.shortlist.map).forEach((k) => {
        if (s.shortlist.map[k]?.id === shortlistId) s.shortlist.acting[k] = true;
      });
    });
    b.addCase(removeShortlist.fulfilled, (s, a) => {
      const id = a.payload;
      s.shortlist.items = s.shortlist.items.filter((x) => x.id !== id);
      Object.keys(s.shortlist.map).forEach((k) => {
        if (s.shortlist.map[k]?.id === id) {
          delete s.shortlist.map[k];
          delete s.shortlist.acting[k];
        }
      });
      toast.success("Removed from shortlist");
    });
    b.addCase(removeShortlist.rejected, (s) => {
      s.shortlist.acting = {};
      toast.error("Failed to remove shortlist");
    });
  },
});

export const { setApplicantsTab, setApplicantsQuery } = slice.actions;
export default slice.reducer;

// ---------------- Selectors (make sure these are exported!) ----------------
export const selectAllApplicants = (s) => s.allApplicants;

export const selectAllApplicantsCounts = (s) => {
  const list = Array.isArray(s.allApplicants.items) ? s.allApplicants.items : [];
  let a = 0, r = 0;
  for (const x of list) {
    if (x.status === "a") a++;
    else if (x.status === "r") r++;
  }
  return { total: list.length, a, r };
};

// Unique cleaner rows (dedupe per cleaner)
export const selectUniqueCleanerRows = (s) => {
  const list = s.allApplicants.items || [];
  const byCleaner = new Map();
  for (const a of list) {
    const id = Number(a.cleaner);
    if (!byCleaner.has(id)) {
      byCleaner.set(id, {
        cleaner_id: id,
        cleaner_name: a.cleaner_name || `Cleaner #${id}`,
        avatar: a.avatar || null,
        applications: [],
        pending_count: 0,
        accepted_count: 0,
      });
    }
    const row = byCleaner.get(id);
    row.applications.push(a);
    if (a.status === "p") row.pending_count++;
    if (a.status === "a") row.accepted_count++;
  }
  return Array.from(byCleaner.values());
};

// shortlist selectors (optional)
export const selectShortlistMap = (s) => s.allApplicants.shortlist.map;
export const selectShortlistActing = (s) => s.allApplicants.shortlist.acting;
