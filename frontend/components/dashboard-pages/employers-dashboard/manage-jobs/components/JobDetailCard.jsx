"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadJobDetail, selectMyJobs } from "@/store/slices/myJobsSlice";

const badge = (t) => <span className="tag" style={{ marginRight: 8 }}>{t}</span>;
const statusText = { o: "Open", p: "Pending", t: "Taken", ip: "In progress", c: "Completed" };

export default function JobDetailCard({ jobId }) {
  const dispatch = useDispatch();
  const { detail, detailStatus } = useSelector(selectMyJobs);

  useEffect(() => {
    if (jobId) dispatch(loadJobDetail(jobId));
  }, [dispatch, jobId]);

  if (detailStatus === "loading" || !detail) {
    return <div className="widget-content">Loading...</div>;
  }

  const sNames = (detail.services || []).map((s) => s.name);

  return (
    <div className="widget-content">
      <div className="job-detail-card">
        <div className="head">
          <h3>{detail.title}</h3>
          <div className="badges">
            {badge(statusText[detail.status] || detail.status)}
            {badge(detail.location || "—")}
            {badge(`${detail.hourly_rate}/hr`)}
            {badge(`${detail.hours_required}h`)}
          </div>
        </div>

        <div className="meta-grid">
          <div>
            <label>Date</label>
            <div>{detail.date || "—"}</div>
          </div>
          <div>
            <label>Start time</label>
            <div>{detail.time || "—"}</div>
          </div>
          <div>
            <label>Estimated total</label>
            <div>{detail.estimated_total != null ? `£${detail.estimated_total}` : "—"}</div>
          </div>
          <div>
            <label>Created</label>
            <div>{detail.created_at ? new Date(detail.created_at).toLocaleString() : "—"}</div>
          </div>
        </div>

        <div className="services">
          <label>Services</label>
          <div className="chips">
            {sNames.length ? sNames.map((n) => <span key={n} className="chip">{n}</span>) : "—"}
          </div>
        </div>

        <div className="desc">
          <label>Description</label>
          <p>{detail.description || "—"}</p>
        </div>
      </div>

      <style jsx>{`
        .job-detail-card {
          background: #fff;
          border: 1px solid #eee;
          border-radius: 12px;
          padding: 20px;
        }
        .head { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
        .badges { display: flex; flex-wrap: wrap; }
        .tag {
          display: inline-block;
          background: #f5f4ff;
          color: #6d5dfc;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          border: 1px solid #ecebff;
        }
        .meta-grid {
          margin-top: 16px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }
        label { display: block; font-weight: 600; color: #6b7280; margin-bottom: 6px; }
        .services { margin-top: 16px; }
        .chips { display: flex; gap: 8px; flex-wrap: wrap; }
        .chip {
          background: #eef9ff;
          color: #0ea5e9;
          border: 1px solid #e1f3ff;
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 12px;
        }
        .desc { margin-top: 16px; }
      `}</style>
    </div>
  );
}
