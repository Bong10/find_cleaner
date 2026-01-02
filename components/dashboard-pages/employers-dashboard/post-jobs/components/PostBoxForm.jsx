"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  selectJobForm,
  selectJobSubmitting,
  updateJobField,
  setJobServices,
  submitJob,
} from "@/store/slices/jobsSlice";
import { loadServices } from "@/store/slices/servicesSlice";
import { toast } from "react-toastify";

// ---- helpers: local YYYY-MM-DD + min time for today ----
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
  return `${String(t.getHours()).padStart(2, "0")}:${String(
    t.getMinutes()
  ).padStart(2, "0")}`;
};

const minTimeForDate = (dateStr) =>
  dateStr === localToday() ? roundUpToNextMinutes(15) : "00:00";

export default function PostBoxForm() {
  const dispatch = useDispatch();
  const form = useSelector(selectJobForm);
  const submitting = useSelector(selectJobSubmitting);
  const { list: services, loading: servicesLoading } = useSelector(
    (s) => s.services
  );

  useEffect(() => {
    if (!services || services.length === 0) {
      dispatch(loadServices());
    }
  }, [dispatch, services]);

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

  const onBasicChange = (name) => (e) =>
    dispatch(updateJobField({ name, value: e?.target ? e.target.value : e }));

  const today = localToday();
  const computedMinTime = minTimeForDate(form.date || "");

  const onDateChange = (e) => {
    const value = e.target.value;
    if (value && value < today) {
      toast.error("Please choose a date today or later.");
      dispatch(updateJobField({ name: "date", value: today }));
      // also adjust time if needed
      const mt = minTimeForDate(today);
      if (form.time && form.time < mt) {
        dispatch(updateJobField({ name: "time", value: mt }));
      }
      return;
    }
    dispatch(updateJobField({ name: "date", value }));

    // If date is today and a past time is set, bump it up
    if (value === today && form.time && form.time < computedMinTime) {
      dispatch(updateJobField({ name: "time", value: computedMinTime }));
      toast.info(`Time adjusted to ${computedMinTime} for today.`);
    }
  };

  const onTimeChange = (e) => {
    let v = e.target.value;
    if (!form.date) {
      toast.error("Pick a date first.");
      return;
    }
    const mt = minTimeForDate(form.date);
    if (form.date === today && v < mt) {
      toast.error(`Please choose a time after ${mt} for today.`);
      v = mt;
    }
    dispatch(updateJobField({ name: "time", value: v }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(submitJob());
  };

  return (
    <>
      <form className="default-form" onSubmit={onSubmit}>
        <div className="row">
          {/* Title */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Job Title</label>
            <input
              type="text"
              placeholder="e.g., Deep Clean for 2-bedroom apartment"
              value={form.title}
              onChange={onBasicChange("title")}
              required
            />
          </div>

          {/* Location */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Location</label>
            <input
              type="text"
              placeholder="Cambridge, CB2 1TN, United Kingdom"
              value={form.location}
              onChange={onBasicChange("location")}
              required
            />
          </div>

          {/* Date (with starry styling + min=today) */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Date</label>
            <div className="starry-input">
              <span className="icon" aria-hidden>
                {/* calendar icon */}
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    d="M7 2v2M17 2v2M3 8h18M5 6h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM7 12h3v3H7v-3z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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

          {/* Time (pretty + disabled until date chosen; min shifts if date = today) */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Start Time</label>
            <div className={`starry-input ${!form.date ? "is-disabled" : ""}`}>
              <span className="icon" aria-hidden>
                {/* clock icon */}
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    d="M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                type="time"
                value={form.time}
                onChange={onTimeChange}
                min={computedMinTime}
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

          {/* Services (Specialisms) */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Specialisms</label>
            <Select
              isMulti
              options={serviceOptions}
              isLoading={servicesLoading}
              value={selectedServiceOptions}
              onChange={(vals) => dispatch(setJobServices(vals.map((v) => v.value)))}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Select one or more services"
            />
          </div>

          {/* Hours required */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Hours required</label>
            <select
              className="chosen-single form-select"
              value={form.hours_required}
              onChange={onBasicChange("hours_required")}
              required
            >
              {Array.from({ length: 16 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="form-group col-lg-12 col-md-12">
            <label>Job Description</label>
            <textarea
              placeholder="Describe the job tasks, access, expectations…"
              value={form.description}
              onChange={onBasicChange("description")}
              required
            />
          </div>

          {/* Save */}
          <div className="form-group col-lg-12 col-md-12">
            <button className="theme-btn btn-style-one" disabled={submitting}>
              {submitting ? "Posting…" : "Save"}
            </button>
          </div>
        </div>
      </form>

      {/* Starry micro-styles for date/time only (scoped) */}
      <style jsx>{`
        .starry-input {
          position: relative;
        }
        .starry-input .icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.65;
          pointer-events: none;
        }
        .starry-control {
          width: 100%;
          padding-left: 40px;
          padding-right: 12px;
          height: 48px;
          border-radius: 10px;
          border: 1px solid #e7e7e7;
          background:
            radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.6), transparent 60%),
            radial-gradient(1.5px 1.5px at 70% 60%, rgba(255,255,255,0.5), transparent 60%),
            radial-gradient(1.5px 1.5px at 40% 80%, rgba(255,255,255,0.5), transparent 60%),
            linear-gradient(180deg, #ffffff, #fafafa);
          transition: box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .starry-control:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15),
            0 0 20px rgba(139, 92, 246, 0.2);
        }
        .is-disabled .starry-control:disabled {
          background: #f6f6f6;
          color: #9aa0a6;
          border-color: #eee;
        }
        .hint {
          display: inline-block;
          margin-top: 6px;
          color: #8e8e8e;
          font-size: 12px;
        }
      `}</style>
    </>
  );
}
