// services/jobsService.js
import api from "@/utils/axiosConfig";

/* ---------- Services ---------- */
export async function fetchServices() {
  const { data } = await api.get("/api/services/");
  return Array.isArray(data) ? data : [];
}

/* ---------- Jobs ---------- */
export async function createJob(payload) {
  const { data } = await api.post("/api/jobs/", payload);
  return data;
}
export const listMyJobs = (params = {}) =>
  api.get("/api/jobs/", { params: { mine: "true", ...params } });
export const listMyJobMetrics = (params = {}) =>
  api.get("/api/jobs/metrics/", { params });
export const getJobMetrics = (params = {}) => listMyJobMetrics(params); // alias
export const archiveJob = (jobId) => api.delete(`/api/jobs/${jobId}/`);
export const getJob = (jobId) => api.get(`/api/jobs/${jobId}/`);
export const updateJob = (jobId, payload) =>
  api.patch(`/api/jobs/${jobId}/`, payload);

/* ---------- Applications ---------- */
// export const listApplicants = (jobId) =>
//   api.get(`/api/job-applications/`, { params: { job: jobId } });
// export const listApplications = (jobId) => listApplicants(jobId); // alias

/* ---------- Applications ---------- */

// Employer context (keep as-is): filter by a specific job id
export const listApplicants = (jobId) =>
  api.get(`/api/job-applications/`, { params: { job: jobId } });

// Cleaner context: list *my* applications (no forced job filter); accepts optional params
export const listApplications = (params = {}) =>
  api.get(`/api/job-applications/`, { params });

// (optional) direct fetch by absolute URL for pagination cursors
export const fetchApplicationsByUrl = (url) => api.get(url);


export const listAllApplicants = () =>
  api.get(`/api/job-applications/`); // employer-scoped on backend

export const acceptApplication = (applicationId) =>
  api.post(`/api/job-applications/${applicationId}/accept/`);
export const rejectApplication = (applicationId, reason = "") =>
  api.post(`/api/job-applications/${applicationId}/reject/`, { reason });

/* ---------- Shortlist ---------- */
export const listShortlist = () => api.get(`/api/shortlist/`);
export const createShortlist = ({ job, cleaner }) =>
  api.post(`/api/shortlist/`, { job, cleaner });
export const deleteShortlist = (id) => api.delete(`/api/shortlist/${id}/`);

// --- Application detail ---
export const getApplication = (applicationId) =>
  api.get(`/api/job-applications/${applicationId}/`);

// Public job list (DRF pagination ready)
// Public job list (DRF pagination ready) — sends salary ONLY when user set it
export const listJobs = (params = {}) => {
  const {
    keyword = "",
    location = "",
    category = "",
    jobType = [],           // array of slugs/ids
    datePosted = "all",     // "all" | "last-hour" | "last-24-hour" | "last-7-days" | "last-14-days" | "last-30-days"
    experience = [],        // array
    salary,                 // <-- NO DEFAULT; stays undefined/null until user commits slider
    sort = "",              // "asc" | "des"
    perPage = { start: 0, end: 0 },
  } = params;

  const page_size = perPage?.end || undefined;   // undefined => server default

  const q = {
    search: keyword || undefined,
    location: location || undefined,
    category: category || undefined,
    job_type: jobType?.length ? jobType.join(",") : undefined,
    experience: experience?.length ? experience.join(",") : undefined,
    // salary_* added below conditionally
    ordering: sort === "des" ? "created_at" : sort === "asc" ? "-created_at" : undefined,
    page_size,
  };

  // ✅ Only include salary when BOTH bounds are real numbers (after user releases slider)
  if (Number.isFinite(salary?.min) && Number.isFinite(salary?.max)) {
    q.salary_min = salary.min;
    q.salary_max = salary.max;
  }

  // DatePosted → query params
  if (datePosted && datePosted !== "all") {
    const now = new Date();
    const from = new Date(now);
    switch (datePosted) {
      case "last-hour":   from.setHours(from.getHours() - 1); break;
      case "last-24-hour":from.setDate(from.getDate() - 1);   break;
      case "last-7-days": from.setDate(from.getDate() - 7);   break;
      case "last-14-days":from.setDate(from.getDate() - 14);  break;
      case "last-30-days":from.setDate(from.getDate() - 30);  break;
      default: /* ignore */ break;
    }
    q.posted_after = from.toISOString();
    q.date_from    = from.toISOString().slice(0, 10);
  }

  // Debug what we actually send
  // eslint-disable-next-line no-console
  console.debug("[jobsService.listJobs] query:", q);

  return api.get("/api/jobs/", { params: q });
};


// Follow absolute DRF `next/previous` URLs
export const fetchJobsByUrl = (url) => api.get(url);