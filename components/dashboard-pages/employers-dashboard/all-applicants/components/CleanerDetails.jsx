// components/.../all-applicants/components/CleanerDetails.jsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllApplicants,
  loadAllApplicants,
  acceptApplicantGlobal,
  rejectApplicantGlobal,
} from "@/store/slices/allApplicantsSlice";
import {
  selectShortlist,
  loadShortlist,
  addToShortlist,
  removeFromShortlist,
} from "@/store/slices/shortlistSlice";
import { toast } from "react-toastify";

// Tiny fallback avatar
const fallbackAvatar =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72'><rect width='100%' height='100%' rx='36' ry='36' fill='#EEF2FF'/><text x='50%' y='56%' font-size='28' text-anchor='middle' fill='#4F46E5' font-family='Arial, Helvetica, sans-serif'>C</text></svg>`
  );

const buildKey = (jobId, cleanerId) => `${Number(jobId)}-${Number(cleanerId)}`;

export default function CleanerDetails() {
  const router = useRouter();
  const search = useSearchParams();
  const cleanerId = Number(search.get("cleaner"));

  const dispatch = useDispatch();

  // Applicants state
  const { items, status, error, acting } = useSelector(selectAllApplicants);

  // Shortlist state (always default everything to safe values)
  const {
    items: shortlistItems = [],
    status: shortlistStatus = "idle",
  } = useSelector(selectShortlist) || { items: [], status: "idle" };

  // Ensure data exists on direct reload (load both)
  React.useEffect(() => {
    if (status === "idle" || !items || items.length === 0) {
      dispatch(loadAllApplicants());
    }
    if (shortlistStatus === "idle" || !shortlistItems) {
      dispatch(loadShortlist());
    }
  }, [dispatch, status, items, shortlistStatus, shortlistItems]);

  // Build cleaner record from store
  const cleaner = React.useMemo(() => {
    const apps = (items || []).filter((x) => Number(x.cleaner) === cleanerId);
    if (apps.length === 0) return null;

    const name = apps[0].cleaner_name || `Cleaner #${cleanerId}`;
    const pending_count = apps.filter((a) => a.status === "p").length;
    const accepted_count = apps.filter((a) => a.status === "a").length;
    const rejected_count = apps.filter((a) => a.status === "r").length;

    // choose a primary job context for shortlist toggle; pick first app
    const primaryJobId = apps[0]?.job ?? null;

    return {
      id: cleanerId,
      name,
      avatar: fallbackAvatar,
      applications: apps,
      primaryJobId,
      counts: {
        total: apps.length,
        pending_count,
        accepted_count,
        rejected_count,
      },
    };
  }, [items, cleanerId]);

  // Build a safe shortlist map (never null)
  const shortlistMap = React.useMemo(() => {
    const arr = Array.isArray(shortlistItems) ? shortlistItems : [];
    const map = {};
    for (const row of arr) {
      if (row && row.job != null && row.cleaner != null) {
        map[buildKey(row.job, row.cleaner)] = row;
      }
    }
    return map;
  }, [shortlistItems]);

  // Is this cleaner shortlisted for the primary job?
  const isShortlisted = React.useMemo(() => {
    if (!cleaner?.primaryJobId) return false;
    const key = buildKey(cleaner.primaryJobId, cleaner.id);
    return Boolean(shortlistMap[key]); // shortlistMap is always an object now
  }, [cleaner, shortlistMap]);

  // Modal state for Reject (reason input only in popup)
  const [rejectFor, setRejectFor] = React.useState(null);

  const onAccept = (applicationId) => {
    toast.info("Accepting applicant…");
    dispatch(acceptApplicantGlobal({ applicationId }));
  };

  const onToggleShortlist = () => {
    if (!cleaner?.primaryJobId) {
      toast.error("No job context to shortlist.");
      return;
    }
    const key = buildKey(cleaner.primaryJobId, cleaner.id);
    const row = shortlistMap[key];

    if (!row) {
      toast.info("Adding to shortlist…");
      dispatch(addToShortlist({ job: cleaner.primaryJobId, cleaner: cleaner.id }));
    } else {
      toast.info("Removing from shortlist…");
      dispatch(removeFromShortlist({ id: row.id }));
    }
  };

  if (status === "loading" && !cleaner) {
    return (
      <div className="tabs-box">
        <div className="widget-title">
          <h4>Loading…</h4>
        </div>
        <div className="widget-content">Please wait.</div>
      </div>
    );
  }

  if (error && !cleaner) {
    return (
      <div className="tabs-box">
        <div className="widget-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4>Error</h4>
          <button className="theme-btn btn-style-three" onClick={() => router.push("/employers-dashboard/all-applicants")}>
            ← Back to list
          </button>
        </div>
        <div className="widget-content">
          {String(error)}{" "}
          <button className="theme-btn btn-style-one" onClick={() => dispatch(loadAllApplicants())}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!cleaner) {
    return (
      <div className="tabs-box">
        <div
          className="widget-title"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <h4>Cleaner — not found</h4>
          <button
            className="theme-btn btn-style-three"
            onClick={() => router.push("/employers-dashboard/all-applicants")}
          >
            ← Back to list
          </button>
        </div>
        <div className="widget-content">No applications for this cleaner.</div>
      </div>
    );
  }

  const { counts } = cleaner;

  return (
    <div className="tabs-box">
      {/* Title row (your snippet) */}
      <div
        className="widget-title"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <h4>
          Cleaner — {cleaner.name}
          <small
            style={{
              marginLeft: 10,
              fontWeight: 400,
              color: "#667085",
              fontSize: 14,
            }}
          >
            ({counts.total} application{counts.total === 1 ? "" : "s"})
          </small>
        </h4>
        <button
          className="theme-btn btn-style-three"
          onClick={() => router.push("/employers-dashboard/all-applicants")}
        >
          ← Back to list
        </button>
      </div>

      {/* Header card: keep design, just add shortlist button next to Book cleaner */}
      <div className="widget-content" style={{ paddingTop: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "14px 0 10px",
          }}
        >
          <figure className="image" style={{ margin: 0 }}>
            <Image
              alt="cleaner"
              src={cleaner.avatar || fallbackAvatar}
              width={72}
              height={72}
              style={{ borderRadius: "50%", border: "1px solid #eef0f4" }}
            />
          </figure>
          <div>
            <div style={{ fontWeight: 600 }}>{cleaner.name}</div>
            <div style={{ color: "#6b7280", fontSize: 14, marginTop: 2 }}>
              Pending: {counts.pending_count} · Accepted: {counts.accepted_count} · Rejected: {counts.rejected_count}
            </div>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {/* Book cleaner: no logic yet → show toaster only */}
            <Link
              href="#"
              className="theme-btn btn-style-one"
              onClick={(e) => {
                e.preventDefault();
                toast.info("Booking flow coming soon.");
              }}
            >
              Book cleaner
            </Link>

            {/* Shortlist toggle button — added next to Book cleaner */}
            <button
              className={`theme-btn ${isShortlisted ? "btn-style-two" : "btn-style-three"}`}
              onClick={onToggleShortlist}
              disabled={!cleaner.primaryJobId}
              title={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
            >
              {isShortlisted ? "Remove shortlist" : "Shortlist"}
            </button>
          </div>
        </div>
      </div>

      {/* Applications table (design unchanged) */}
      <div className="widget-content">
        <div className="table-outer">
          <table className="default-table manage-job-table">
            <thead>
              <tr>
                <th>Job</th>
                <th>Cover letter</th>
                <th>Applied</th>
                <th>Status</th>
                <th style={{ width: 260, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cleaner.applications.length === 0 && (
                <tr>
                  <td colSpan={5}>No applications for this cleaner.</td>
                </tr>
              )}

              {cleaner.applications.map((a) => (
                <tr key={a.application_id}>
                  <td>{a.job_title || a.job}</td>
                  <td
                    style={{
                      maxWidth: 420,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={a.cover_letter || ""}
                  >
                    {a.cover_letter || "—"}
                  </td>
                  <td>{a.date_applied || "—"}</td>
                  <td>
                    <span className={`status-badge status-${a.status}`}>
                      {a.status === "p" ? "Pending" : a.status === "a" ? "Accepted" : "Rejected"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {a.status === "p" ? (
                      <div style={{ display: "inline-flex", gap: 8 }}>
                        <button
                          className="theme-btn btn-style-one"
                          onClick={() => onAccept(a.application_id)}
                          disabled={!!acting[a.application_id]}
                        >
                          Accept
                        </button>
                        <button
                          className="theme-btn btn-style-two"
                          onClick={() => setRejectFor(a)} // open modal for reason
                          disabled={!!acting[a.application_id]}
                        >
                          Reject
                        </button>
                      </div>
                    ) : a.status === "a" ? (
                      <Link
                        href="#"
                        className="theme-btn btn-style-three"
                        onClick={(e) => {
                          e.preventDefault();
                          toast.info("Tracking progress page coming soon.");
                        }}
                      >
                        Track progress
                      </Link>
                    ) : (
                      <span style={{ color: "#888" }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Keep your small badge styles only */}
        <style jsx>{`
          .status-badge {
            display: inline-block;
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 12px;
            border: 1px solid #eee;
          }
          .status-p { background:#fff9eb; color:#b45309; border-color:#fde68a; }
          .status-a { background:#ecfdf5; color:#065f46; border-color:#a7f3d0; }
          .status-r { background:#fef2f2; color:#991b1b; border-color:#fecaca; }
        `}</style>
      </div>

      {/* Reject modal (unchanged layout, cleaner look) */}
      {rejectFor && (
        <RejectModal
          app={rejectFor}
          cleanerName={cleaner.name}
          pending={!!acting[rejectFor.application_id]}
          onClose={() => setRejectFor(null)}
          onSubmit={(reason) => {
            toast.info("Rejecting applicant…");
            dispatch(
              rejectApplicantGlobal({
                applicationId: rejectFor.application_id,
                reason,
              })
            );
            setRejectFor(null);
          }}
        />
      )}
    </div>
  );
}

/* ============ Reject modal ============ */
function RejectModal({ app, cleanerName, pending, onClose, onSubmit }) {
  const [reason, setReason] = React.useState("");
  const textareaRef = React.useRef(null);

  React.useEffect(() => {
    textareaRef.current?.focus({ preventScroll: true });
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const stop = (e) => e.stopPropagation();

  return (
    <div className="reject-overlay" onClick={onClose}>
      <div className="reject-card" role="dialog" aria-modal="true" onClick={stop}>
        <div className="reject-head">
          <h4>Reject application</h4>
          <button className="reject-close" onClick={onClose} aria-label="Close">
            <span className="la la-times" />
          </button>
        </div>

        <p className="reject-sub">
          Cleaner <strong>{cleanerName}</strong> — <span>{app.job_title || app.job}</span>
        </p>

        <label className="reject-label">Reason (optional)</label>
        <textarea
          ref={textareaRef}
          className="form-control"
          rows={4}
          placeholder="Add a short reason…"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="reject-actions">
          <button className="theme-btn btn-style-two" onClick={onClose}>
            Cancel
          </button>
          <button
            className="theme-btn btn-style-one"
            disabled={pending}
            onClick={() => onSubmit(reason)}
          >
            {pending ? "Submitting…" : "Submit"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .reject-overlay {
          position: fixed; inset: 0;
          background: rgba(12,20,32,0.45);
          backdrop-filter: blur(2px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1100;
        }
        .reject-card {
          width: 96%; max-width: 560px;
          background: #fff;
          border: 1px solid #eef0f4;
          border-radius: 14px;
          box-shadow: 0 16px 48px rgba(15,23,42,0.14);
          padding: 18px 20px;
        }
        .reject-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 8px;
        }
        .reject-head h4 { margin: 0; font-size: 18px; font-weight: 600; }
        .reject-close {
          background: transparent; border: none; cursor: pointer;
          width: 34px; height: 34px; border-radius: 8px; display: grid; place-items: center;
        }
        .reject-close:hover { background: #f3f4f6; }
        .reject-sub { margin: 0 0 12px; color: #6b7280; font-size: 14px; }
        .reject-label { display: block; font-size: 14px; color: #374151; margin-bottom: 6px; }
        .form-control {
          width: 100%; border: 1px solid #e7e7e7; border-radius: 10px;
          padding: 10px 12px; font-size: 14px; resize: vertical; background: #fff;
        }
        .form-control:focus {
          outline: none; border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139,92,246,0.15);
        }
        .reject-actions {
          display: flex; gap: 10px; justify-content: flex-end; margin-top: 14px;
        }
      `}</style>
    </div>
  );
}
