"use client";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadApplicants,
  acceptApplicant,
  rejectApplicant,
  selectMyJobs,
} from "@/store/slices/myJobsSlice";
import { toast } from "react-toastify";

export default function ApplicantsTable({ jobId, onTrackProgress }) {
  const dispatch = useDispatch();
  const { applicantsByJob, applicantsStatus } = useSelector(selectMyJobs);
  const applicants = applicantsByJob[jobId] || [];

  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (jobId) dispatch(loadApplicants(jobId));
  }, [dispatch, jobId]);

  // if one is accepted, disable Accept on the rest
  const hasAccepted = useMemo(
    () => applicants.some((a) => a.status === "a"),
    [applicants]
  );

  const onAccept = async (applicationId) => {
    if (hasAccepted) {
      toast.info("An applicant has already been accepted for this job.");
      return;
    }
    try {
      setBusyId(applicationId);
      await dispatch(acceptApplicant({ jobId, applicationId })).unwrap();
      // list refresh happens inside thunk
    } catch (_) {
      /* errors are toasted in thunk */
    } finally {
      setBusyId(null);
    }
  };

  const onReject = async (applicationId) => {
    const reason = window.prompt("Please enter a rejection reason:");
    if (reason == null) return; // cancelled
    if (!reason.trim()) {
      toast.error("Rejection reason is required.");
      return;
    }
    try {
      setBusyId(applicationId);
      await dispatch(
        rejectApplicant({ jobId, applicationId, reason: reason.trim() })
      ).unwrap();
    } catch (_) {
      /* errors are toasted in thunk */
    } finally {
      setBusyId(null);
    }
  };

  const track = (app) => {
    if (onTrackProgress) onTrackProgress({ jobId, application: app });
    else toast.info("Track progress page coming soon.");
  };

  return (
    <div className="widget-content">
      <div className="table-outer">
        <table className="default-table manage-job-table">
          <thead>
            <tr>
              <th>Cleaner</th>
              <th>Cover letter</th>
              <th>Applied</th>
              <th>Status</th>
              <th style={{ width: 240 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicantsStatus === "loading" && (
              <tr>
                <td colSpan={5}>Loading…</td>
              </tr>
            )}
            {applicantsStatus !== "loading" && applicants.length === 0 && (
              <tr>
                <td colSpan={5}>No applicants yet.</td>
              </tr>
            )}
            {applicants.map((a) => {
              const isBusy = busyId === a.application_id;
              return (
                <tr key={a.application_id}>
                  <td>{a.cleaner_name || a.cleaner}</td>

                  {/* Cover letter column */}
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

                  {/* Applied date */}
                  <td>{a.date_applied || "—"}</td>

                  {/* Status column */}
                  <td>
                    <span className={`status-badge status-${a.status}`}>
                      {a.status === "p"
                        ? "Pending"
                        : a.status === "a"
                        ? "Accepted"
                        : "Rejected"}
                    </span>
                  </td>

                  {/* Actions column (buttons only) */}
                  <td>
                    {a.status === "a" ? (
                      <button
                        className="theme-btn btn-style-three"
                        onClick={() => track(a)}
                      >
                        Track progress
                      </button>
                    ) : a.status === "r" ? (
                      <span className="text-muted">—</span>
                    ) : (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="theme-btn btn-style-one"
                          onClick={() => onAccept(a.application_id)}
                          disabled={hasAccepted || isBusy}
                          title={
                            hasAccepted
                              ? "An applicant is already accepted"
                              : ""
                          }
                        >
                          {isBusy ? "Working…" : "Accept"}
                        </button>
                        <button
                          className="theme-btn btn-style-two"
                          onClick={() => onReject(a.application_id)}
                          disabled={isBusy}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Keep your existing badges exactly as before */}
      <style jsx>{`
        .status-badge {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          border: 1px solid #eee;
        }
        .status-p {
          background: #fff9eb;
          color: #b45309;
          border-color: #fde68a;
        }
        .status-a {
          background: #ecfdf5;
          color: #065f46;
          border-color: #a7f3d0;
        }
        .status-r {
          background: #fef2f2;
          color: #991b1b;
          border-color: #fecaca;
        }
        .text-muted {
          color: #7a7a7a;
        }
      `}</style>
    </div>
  );
}
