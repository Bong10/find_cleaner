"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplications } from "@/store/slices/applicationsSlice";
import { getJob } from "@/services/jobsService";

// status colors — ONLY color changed; your labels/structure unchanged
const STATUS_LABEL = { p: "Pending", a: "Accepted", r: "Rejected" };
const STATUS_COLOR = { p: "#9CA3AF", a: "#059669", r: "#DC2626" };

// inline SVG fallback (no external file)
const DEFAULT_LOGO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='50' height='49'>
       <rect width='100%' height='100%' rx='8' ry='8' fill='#F3F4F6'/>
       <text x='50%' y='58%' text-anchor='middle' font-size='20' fill='#9CA3AF'>🏢</text>
     </svg>`
  );

const absolutize = (url) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
  const path = url.startsWith("/") ? url : `/${url}`;
  return base ? `${base}${path}` : url;
};

const RANGE = [
  { value: "6m", months: 6, label: "Last 6 Months" },
  { value: "12m", months: 12, label: "Last 12 Months" },
  { value: "16m", months: 16, label: "Last 16 Months" },
  { value: "24m", months: 24, label: "Last 24 Months" },
  { value: "60m", months: 60, label: "Last 5 year" },
];

const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

export default function JobListingsTable() {
  const dispatch = useDispatch();
  const { list, loading, error, hasLoadedOnce } = useSelector((s) => s.applications || {});
  const [range, setRange] = useState(RANGE[0].value);

  // ✅ fetch once per mount (even in React StrictMode)
  const didFetch = useRef(false);
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    if (!hasLoadedOnce) {
      console.debug("[JobListingsTable] dispatch fetchApplications()");
      dispatch(fetchApplications()); // no params; cleaner-scoped on backend
    }
  }, [dispatch, hasLoadedOnce]);

  // optional job cache (title/location) without extra loops
  const [jobCache, setJobCache] = useState({});
  useEffect(() => {
    const results = Array.isArray(list?.results) ? list.results : [];
    if (!results.length) return;
    let cancelled = false;
    (async () => {
      const next = { ...jobCache };
      for (const r of results) {
        const jobId = r?.job;
        if (!jobId || next[jobId]) continue;
        try {
          const { data } = await getJob(jobId);
          next[jobId] = data || {};
        } catch {/* ignore */}
      }
      if (!cancelled) setJobCache(next);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list?.results]);

  const rows = useMemo(() => {
    const items = Array.isArray(list?.results) ? list.results : [];

    // range filter (kept same control)
    const chosen = RANGE.find((r) => r.value === range) || RANGE[0];
    const cutoff = new Date(); cutoff.setMonth(cutoff.getMonth() - chosen.months);

    const mapped = items.map((a, idx) => {
      const id = a.application_id ?? a.id ?? `row-${idx}`;
      const jobId = a.job;

      const job = jobId ? jobCache[jobId] : null;
      const title = a.job_title || job?.title || "—";
      const where =
        a.job_location ||
        job?.location ||
        [job?.address?.city, job?.address?.country].filter(Boolean).join(", ") ||
        "—";

      const logoRaw =
        a.employer_logo ||
        job?.employer_logo ||
        job?.employer?.user?.profile_picture ||
        "";
      const logo = logoRaw ? absolutize(logoRaw) : DEFAULT_LOGO;

      const date = a.date_applied || a.created_at || a.updated_at || null;

      const code = String(a.status || "p").toLowerCase();
      const statusText = STATUS_LABEL[code] || a.status || "Pending";

      return { id, jobId, title, where, logo, date, code, statusText };
    });

    const filtered = mapped.filter((r) => {
      if (!r.date) return true;
      const d = new Date(r.date);
      if (isNaN(d.getTime())) return true;
      return d >= cutoff;
    });

    console.debug("[JobListingsTable] rows", {
      received: items.length,
      afterFilter: filtered.length,
    });

    return filtered;
  }, [list?.results, jobCache, range]);

  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>My Applied Jobs</h4>

        {/* keep your original select */}
        <div className="chosen-outer">
          <select
            className="chosen-single form-select"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            {RANGE.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="widget-content">
        <div className="table-outer">
          <table className="default-table manage-job-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Date Applied</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr><td colSpan={4}>Loading…</td></tr>
              )}

              {!loading && error && (
                <tr><td colSpan={4} style={{ color: "#b91c1c" }}>{error}</td></tr>
              )}

              {!loading && !error && rows.length === 0 && (
                <tr><td colSpan={4}>No applications found.</td></tr>
              )}

              {!loading && !error && rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="job-block">
                      <div className="inner-box">
                        <div className="content">
                          <span className="company-logo">
                            <img src={r.logo} width={50} height={49} alt="logo" />
                          </span>
                          <h4>
                            {r.jobId ? (
                              <Link href={`/job-single-v3/${r.jobId}`}>{r.title}</Link>
                            ) : r.title}
                          </h4>
                          <ul className="job-info">
                            <li>
                              <span className="icon flaticon-map-locator"></span>
                              {r.where || "—"}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>{fmtDate(r.date)}</td>

                  <td className="status">
                    <span style={{ color: STATUS_COLOR[r.code] || "inherit" }}>
                      {r.statusText}
                    </span>
                  </td>

                  <td>
                    <div className="option-box">
                      <ul className="option-list">
                        <li>
                          <a
                            data-text="View Application"
                            href={`/candidates-dashboard/applied-jobs?application=${r.id}`}
                          >
                            <span className="la la-eye"></span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
