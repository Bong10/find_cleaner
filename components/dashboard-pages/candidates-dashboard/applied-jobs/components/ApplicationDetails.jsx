// components/dashboard-pages/candidates-dashboard/applied-jobs/ApplicationDetails.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { getApplication, getJob } from "@/services/jobsService";

const STATUS_LABEL = { p: "Pending", a: "Accepted", r: "Rejected" };
const STATUS_COLOR = { p: "#F59E0B", a: "#059669", r: "#DC2626" };

// inline SVG fallback for company logo (keeps your card spacing tidy)
const DEFAULT_LOGO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='50' height='49'>
       <rect width='100%' height='100%' rx='8' ry='8' fill='#F3F4F6'/>
       <text x='50%' y='58%' text-anchor='middle' font-size='20' fill='#9CA3AF'>🏢</text>
     </svg>`
  );

const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

export default function ApplicationDetails() {
  const search = useSearchParams();
  const applicationId = search.get("application");

  // try cache first (from the list page slice)
  const list = useSelector((s) => s.applications?.list?.results || []);
  const cached = useMemo(
    () => list.find((x) => String(x.application_id || x.id) === String(applicationId)),
    [list, applicationId]
  );

  const [app, setApp] = useState(cached || null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState("");

  // fetch application exactly once if not cached
  const appFetched = useRef(false);
  useEffect(() => {
    if (app || appFetched.current || !applicationId) return;
    appFetched.current = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await getApplication(applicationId);
        setApp(data || null);
      } catch {
        setError("Failed to load application.");
      } finally {
        setLoading(false);
      }
    })();
  }, [app, applicationId]);

  // fetch job exactly once (we need hours/rate/total from job)
  const jobFetched = useRef(false);
  useEffect(() => {
    const jobId = app?.job; // application has job id
    if (!jobId || jobFetched.current) return;
    jobFetched.current = true;
    (async () => {
      try {
        const { data } = await getJob(jobId);
        setJob(data || null);
      } catch {
        /* ignore */
      }
    })();
  }, [app]);

  const vm = useMemo(() => {
    const code = String(app?.status || "p").toLowerCase();
    const statusText = STATUS_LABEL[code] || "Pending";
    const statusColor = STATUS_COLOR[code] || "#9CA3AF";

    const title = app?.job_title || job?.title || "—";
    const where = job?.location || "—";

    // services from JobDetailSerializer → ServiceMiniSerializer(name,…)
    let services = "—";
    if (Array.isArray(job?.services) && job.services.length) {
      services = job.services.map((s) => s?.name).filter(Boolean).join(", ");
    }

    const appliedOn = app?.date_applied || app?.created_at || null;

    // 🔑 pull from JOB, as requested
    const hours = job?.hours_required ?? "—";
    const rate = job?.hourly_rate ?? "—";
    const total =
      job?.estimated_total ??
      (Number(job?.hours_required) > 0 && Number(job?.hourly_rate) > 0
        ? (Number(job.hours_required) * Number(job.hourly_rate)).toFixed(2)
        : "—");

    return {
      statusText,
      statusColor,
      title,
      where,
      logo: DEFAULT_LOGO, // your JobDetail payload doesn’t include a logo; keep safe placeholder
      appliedOn,
      services,
      hours,
      rate,
      total,
    };
  }, [app, job]);

  return (
    <div className="ls-widget">
      <div className="tabs-box">
        <div
          className="widget-title"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <h4>Application Details</h4>
          <Link href="/candidates-dashboard/applied-jobs" className="theme-btn btn-style-three">
            ← Back to list
          </Link>
        </div>

        <div className="widget-content">
          {loading ? (
            <div style={{ padding: 16 }}>Loading…</div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            <>
              {/* Top card (same classes/structure) */}
              <div className="job-block" style={{ border: "1px solid #EEF2FF", borderRadius: 8 }}>
                <div className="inner-box">
                  <div className="content" style={{ display: "flex", alignItems: "center",}}>
                    <span className="company-logo" style={{ marginRight: 16 }}>
                      <img src={vm.logo} alt="logo" width={50} height={49} />
                    </span>

                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0 }}>{vm.title}</h4>
                      <ul className="job-info" style={{ marginTop: 6 }}>
                        <li>
                          <span className="icon flaticon-map-locator"></span>
                          {vm.where}
                        </li>
                      </ul>
                    </div>

                    <div className="status" style={{ color: vm.statusColor, fontWeight: 600 }}>
                      {vm.statusText}
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta row (unchanged classes) */}
              <div
                className="job-other-info"
                style={{
                  marginTop: 16,
                  border: "1px solid #EEF2FF",
                  borderRadius: 8,
                  padding: 16,
                  display: "grid",
                  gridTemplateColumns: "repeat(6, minmax(0,1fr))",
                  gap: 12,
                }}
              >
                <div>
                  <strong>Applied:</strong> {fmtDate(vm.appliedOn)}
                </div>
                <div>
                  <strong>Services:</strong> {vm.services}
                </div>
                <div>
                  <strong>Schedule:</strong> {job?.date || "—"}
                </div>
                <div>
                  <strong>Hours:</strong> {String(vm.hours)}
                </div>
                <div>
                  <strong>Rate:</strong> {String(vm.rate)}
                </div>
                <div>
                  <strong>Total:</strong> {String(vm.total)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
