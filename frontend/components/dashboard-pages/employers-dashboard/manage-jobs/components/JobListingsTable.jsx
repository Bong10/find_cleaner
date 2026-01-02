"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyJobs,
  fetchMyJobMetrics,
  archiveMyJob,
  setFilterMonths,
  selectMyJobs,
} from "@/store/slices/myJobsSlice";

// Inline subviews (already provided earlier)
import JobDetailCard from "./JobDetailCard";
import JobEditForm from "./JobEditForm";
import ApplicantsTable from "./ApplicantsTable";

const API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL
    ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "")
    : "") || "";

const resolveMediaUrl = (p) =>
  !p ? "" : /^https?:\/\//i.test(p) ? p : `${API_BASE}${p.startsWith("/") ? "" : "/"}${p}`;

const statusLabel = (code) =>
  ({ o: "Open", p: "Pending", t: "Taken", ip: "In progress", c: "Completed" }[code] ||
    code ||
    "—");

const monthOptions = [
  { label: "Last 6 Months", value: 6 },
  { label: "Last 12 Months", value: 12 },
  { label: "Last 16 Months", value: 16 },
  { label: "Last 24 Months", value: 24 },
  { label: "Last 5 year", value: 60 },
];

export default function JobListingsTable() {
  const dispatch = useDispatch();
  const { items, metricsById, status, archivingIds, filterMonths } =
    useSelector(selectMyJobs);

  const [logoFallback] = useState("/images/resource/company-6.png");

  // ---------- inline view state (no new routes) ----------
  // modes: "list" | "view" | "edit" | "applicants"
  const [mode, setMode] = useState("list");
  const [selectedJobId, setSelectedJobId] = useState(null);

  const goList = useCallback(() => {
    setMode("list");
    setSelectedJobId(null);
    // refresh when coming back
    dispatch(fetchMyJobs({ months: filterMonths }));
    dispatch(fetchMyJobMetrics());
  }, [dispatch, filterMonths]);

  const goView = (jobId) => {
    setSelectedJobId(jobId);
    setMode("view");
  };
  const goEdit = (jobId) => {
    setSelectedJobId(jobId);
    setMode("edit");
  };
  const goApplicants = (jobId) => {
    setSelectedJobId(jobId);
    setMode("applicants");
  };

  // ---------- load jobs/metrics ----------
  useEffect(() => {
    dispatch(fetchMyJobs({ months: filterMonths }));
    dispatch(fetchMyJobMetrics());
  }, [dispatch, filterMonths]);

  const loading = status === "loading";
  const rows = useMemo(() => items || [], [items]);
  const selectedJob =
    selectedJobId != null ? rows.find((j) => j.job_id === selectedJobId) : null;

  const onFilterChange = (e) => {
    const months = Number(e.target.value);
    dispatch(setFilterMonths(months));
  };

  // ---------- LIST MODE ----------
  if (mode === "list") {
    return (
      <div className="tabs-box">
        <div className="widget-title">
          <h4>My Job Listings</h4>
          <div className="chosen-outer">
            <select
              className="chosen-single form-select"
              value={filterMonths}
              onChange={onFilterChange}
            >
              {monthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="widget-content">
          <div className="table-outer">
            <table className="default-table manage-job-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Applications</th>
                  <th>Created &amp; Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading && rows.length === 0 && (
                  <tr>
                    <td colSpan={5}>Loading…</td>
                  </tr>
                )}
                {!loading && rows.length === 0 && (
                  <tr>
                    <td colSpan={5}>No jobs found.</td>
                  </tr>
                )}

                {rows.map((job) => {
                  const metrics = metricsById[job.job_id] || {};
                  const applied = metrics.applicants_total ?? "—";
                  const created = job.created_at
                    ? new Date(job.created_at).toLocaleDateString()
                    : "—";
                  const jobDate = job.date || "—";
                  const isArchiving = !!archivingIds[job.job_id];
                  const logo = resolveMediaUrl(job.logo) || logoFallback;

                  return (
                    <tr key={job.job_id}>
                      <td>
                        <div className="job-block">
                          <div className="inner-box">
                            <div className="content">
                              <span className="company-logo">
                                <Image
                                  width={50}
                                  height={49}
                                  src={logo}
                                  alt="logo"
                                />
                              </span>
                              <h4>
                                {/* View details inline */}
                                <button
                                  type="button"
                                  className="link-btn"
                                  onClick={() => goView(job.job_id)}
                                  title="View Job"
                                  style={{ background: "none", border: 0, padding: 0 }}
                                >
                                  {job.title}
                                </button>
                              </h4>
                              <ul className="job-info">
                                <li>
                                  <span className="icon flaticon-briefcase"></span>
                                  Cleaning
                                </li>
                                <li>
                                  <span className="icon flaticon-map-locator"></span>
                                  {job.location || "—"}
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="applied">
                        <button
                          type="button"
                          className="link-btn"
                          onClick={() => goApplicants(job.job_id)}
                          title="Applicants"
                          style={{ background: "none", border: 0, padding: 0 }}
                        >
                          {applied}+ Applied
                        </button>
                      </td>

                      <td>
                        {created} <br /> {jobDate}
                      </td>

                      <td className="status">{statusLabel(job.status)}</td>

                      <td>
                        <div className="option-box">
                          <ul className="option-list">
                            <li>
                              <button
                                data-text="View Job"
                                title="View Job"
                                onClick={() => goView(job.job_id)}
                              >
                                <span className="la la-eye"></span>
                              </button>
                            </li>
                            <li>
                              <button
                                data-text="Edit Job"
                                title="Edit Job"
                                onClick={() => goEdit(job.job_id)}
                              >
                                <span className="la la-pencil"></span>
                              </button>
                            </li>
                            <li>
                              <button
                                data-text="Applicants"
                                title="Applicants"
                                onClick={() => goApplicants(job.job_id)}
                              >
                                <span className="la la-users"></span>
                              </button>
                            </li>
                            <li>
                              <button
                                data-text="Archive Job"
                                title={isArchiving ? "Archiving…" : "Archive Job"}
                                onClick={() => dispatch(archiveMyJob(job.job_id))}
                                disabled={isArchiving}
                              >
                                <span className="la la-trash"></span>
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ---------- SUBVIEWS ----------
  return (
    <>
      <div className="widget-title" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h4 style={{ margin: 0 }}>
          {mode === "view" && "Job Details"}
          {mode === "edit" && "Edit Job"}
          {mode === "applicants" && "Applicants"}
          {selectedJob ? ` — ${selectedJob.title}` : ""}
        </h4>
        <button className="theme-btn btn-style-one" onClick={goList}>
          ← Back to list
        </button>
      </div>

      {mode === "view" && <JobDetailCard jobId={selectedJobId} />}

      {mode === "edit" && <JobEditForm jobId={selectedJobId} />}

      {mode === "applicants" && <ApplicantsTable jobId={selectedJobId} />}
    </>
  );
}
