"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  loadJobDetail,
  saveJobEdits,
  selectMyJobs,
} from "@/store/slices/myJobsSlice";
import { loadServices } from "@/store/slices/servicesSlice";

// Helpers copied from Post Job section for exact behavior
const localToday = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const roundUpToNextMinutes = (minutes = 15) => {
  const d = new Date();
  d.setSeconds(0, 0);
  const step = minutes * 60 * 1000;
  const t = new Date(Math.ceil(d.getTime() / step) * step);
  return `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
};
const minTimeForDate = (dateStr) =>
  dateStr === localToday() ? roundUpToNextMinutes(15) : "00:00";

export default function JobEditForm({ jobId }) {
  const dispatch = useDispatch();
  const { detail, detailStatus, saving } = useSelector(selectMyJobs);
  const { list: services, loading: servicesLoading } = useSelector((s) => s.services);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    hourly_rate: "",
    hours_required: 1,
    services: [],
  });

  // load job + services
  useEffect(() => {
    if (jobId) dispatch(loadJobDetail(jobId));
    if (!services || services.length === 0) dispatch(loadServices());
  }, [dispatch, jobId]);

  // hydrate when detail arrives
  useEffect(() => {
    if (detailStatus === "succeeded" && detail?.job_id === jobId) {
      setForm({
        title: detail.title || "",
        description: detail.description || "",
        location: detail.location || "",
        date: detail.date || "",
        time: detail.time || "",
        hourly_rate: detail.hourly_rate ?? "",
        hours_required: detail.hours_required ?? 1,
        services: (detail.services || []).map((s) => s.id), // ids
      });
    }
  }, [detailStatus, detail, jobId]);

  const serviceOptions = useMemo(
    () =>
      (services || []).map((s) => ({
        value: s.id,
        label:
          s.min_hourly_rate != null && s.min_hours_required != null
            ? `${s.name} (min ${s.min_hourly_rate}/hr, ${s.min_hours_required}h)`
            : s.name,
      })),
    [services]
  );
  const selectedServiceOptions = useMemo(
    () => serviceOptions.filter((o) => form.services.includes(o.value)),
    [serviceOptions, form.services]
  );

  const today = localToday();
  const computedMinTime = minTimeForDate(form.date || "");

  const onChange = (name, val) => setForm((f) => ({ ...f, [name]: val }));

  const onDateChange = (e) => {
    const value = e.target.value;
    if (value && value < today) {
      toast.error("Please choose a date today or later.");
      onChange("date", today);
      const mt = minTimeForDate(today);
      if (form.time && form.time < mt) onChange("time", mt);
      return;
    }
    onChange("date", value);
    if (value === today && form.time && form.time < computedMinTime) {
      onChange("time", computedMinTime);
      toast.info(`Time adjusted to ${computedMinTime} for today.`);
    }
  };

  const onTimeChange = (e) => {
    let v = e.target.value;
    if (!form.date) return toast.error("Pick a date first.");
    const mt = minTimeForDate(form.date);
    if (form.date === today && v < mt) {
      toast.error(`Please choose a time after ${mt} for today.`);
      v = mt;
    }
    onChange("time", v);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      date: form.date,
      time: form.time,
      hourly_rate: form.hourly_rate === "" ? 0 : Number(form.hourly_rate),
      hours_required: Number(form.hours_required) || 1,
      services: form.services,
    };
    dispatch(saveJobEdits({ jobId, payload }));
  };

  if (detailStatus === "loading" && !detail) {
    return <div className="widget-content">Loading…</div>;
  }

  return (
    <div className="widget-content">
      <form className="default-form" onSubmit={onSubmit}>
        <div className="row">
          <div className="form-group col-lg-6 col-md-12">
            <label>Job Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => onChange("title", e.target.value)}
              required
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label>Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => onChange("location", e.target.value)}
              required
            />
          </div>

          {/* Starry date */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Date</label>
            <div className="starry-input">
              <span className="icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M7 2v2M17 2v2M3 8h18M5 6h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM7 12h3v3H7v-3z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input
                type="date"
                value={form.date}
                min={today}
                onChange={onDateChange}
                required
                className="starry-control"
              />
            </div>
            <small className="hint">Past dates are disabled.</small>
          </div>

          {/* Starry time */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Start Time</label>
            <div className={`starry-input ${!form.date ? "is-disabled" : ""}`}>
              <span className="icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input
                type="time"
                value={form.time}
                onChange={onTimeChange}
                min={minTimeForDate(form.date || "")}
                step="300"
                required
                disabled={!form.date}
                className="starry-control"
              />
            </div>
            <small className="hint">
              {form.date === today
                ? `Earliest today: ${computedMinTime}`
                : form.date
                ? "Pick any time."
                : "Choose a date first."}
            </small>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label>Hourly rate</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.hourly_rate}
              onChange={(e) => onChange("hourly_rate", e.target.value)}
              required
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label>Hours required</label>
            <select
              className="chosen-single form-select"
              value={form.hours_required}
              onChange={(e) => onChange("hours_required", e.target.value)}
              required
            >
              {Array.from({ length: 16 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* React-Select services (same as post) */}
          <div className="form-group col-lg-12 col-md-12">
            <label>Specialisms (Services)</label>
            <Select
              isMulti
              options={serviceOptions}
              isLoading={servicesLoading}
              value={selectedServiceOptions}
              onChange={(vals) => onChange("services", (vals || []).map((v) => v.value))}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Select one or more services"
            />
          </div>

          <div className="form-group col-lg-12 col-md-12">
            <label>Job Description</label>
            <textarea
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
              required
            />
          </div>

          <div className="form-group col-lg-12 col-md-12">
            <button className="theme-btn btn-style-one" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </form>

      {/* same starry micro-styles */}
      <style jsx>{`
        .starry-input { position: relative; }
        .starry-input .icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.65; pointer-events: none; }
        .starry-control {
          width: 100%; padding-left: 40px; padding-right: 12px; height: 48px;
          border-radius: 10px; border: 1px solid #e7e7e7;
          background:
            radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.6), transparent 60%),
            radial-gradient(1.5px 1.5px at 70% 60%, rgba(255,255,255,0.5), transparent 60%),
            radial-gradient(1.5px 1.5px at 40% 80%, rgba(255,255,255,0.5), transparent 60%),
            linear-gradient(180deg, #ffffff, #fafafa);
          transition: box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .starry-control:focus { outline: none; border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15), 0 0 20px rgba(139, 92, 246, 0.2);
        }
        .is-disabled .starry-control:disabled { background: #f6f6f6; color: #9aa0a6; border-color: #eee; }
        .hint { display: inline-block; margin-top: 6px; color: #8e8e8e; font-size: 12px; }
      `}</style>
    </div>
  );
}
