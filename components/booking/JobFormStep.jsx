"use client";

import { useMemo } from "react";
import Select from "react-select";

// Helper functions from PostBoxForm
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

const JobFormStep = ({ 
  jobForm, 
  services, 
  servicesLoading,
  dispatch, 
  updateJobField,
  setJobServices,
  onNext, 
  onBack 
}) => {
  
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
    () => serviceOptions.filter((o) => jobForm.services.includes(o.value)),
    [serviceOptions, jobForm.services]
  );

  const onBasicChange = (name) => (e) =>
    dispatch(updateJobField({ name, value: e?.target ? e.target.value : e }));

  const today = localToday();
  const computedMinTime = minTimeForDate(jobForm.date || "");

  const onDateChange = (e) => {
    const value = e.target.value;
    if (value && value < today) {
      dispatch(updateJobField({ name: "date", value: today }));
      // Also adjust time if needed
      const mt = minTimeForDate(today);
      if (jobForm.time && jobForm.time < mt) {
        dispatch(updateJobField({ name: "time", value: mt }));
      }
      return;
    }
    dispatch(updateJobField({ name: "date", value }));

    // If date is today and a past time is set, bump it up
    if (value === today && jobForm.time && jobForm.time < computedMinTime) {
      dispatch(updateJobField({ name: "time", value: computedMinTime }));
    }
  };

  const onTimeChange = (e) => {
    let v = e.target.value;
    if (!jobForm.date) {
      return;
    }
    const mt = minTimeForDate(jobForm.date);
    if (jobForm.date === today && v < mt) {
      v = mt;
    }
    dispatch(updateJobField({ name: "time", value: v }));
  };
  
  return (
    <>
      <style jsx>{`
        .job-form-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          margin-top: 30px;
          animation: slideInUp 0.5s ease;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .form-title {
          font-size: 24px;
          font-weight: 700;
          color: #202124;
          margin-bottom: 30px;
        }
        
        .form-group {
          margin-bottom: 25px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 10px;
          font-weight: 600;
          color: #202124;
          font-size: 14px;
        }
        
        .form-control {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #e4e4e4;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.3s;
        }
        
        .form-control:focus {
          outline: none;
          border-color: #4C9A99;
          box-shadow: 0 0 0 3px rgba(76, 154, 153, 0.1);
        }
        
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
          border: 2px solid #e4e4e4;
          background: white;
          transition: all 0.3s;
        }
        
        .starry-control:focus {
          outline: none;
          border-color: #4C9A99;
          box-shadow: 0 0 0 3px rgba(76, 154, 153, 0.1);
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
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        textarea.form-control {
          min-height: 120px;
          resize: vertical;
        }        
        
        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 40px;
        }
    
        .btn {
          padding: 15px 35px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        
        .btn-secondary {
          background: #f3f4f6;
          color: #4b5563;
        }
        
        .btn-secondary:hover {
          background: #e5e7eb;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #4C9A99 0%, #2d5f5f 100%);
          color: white;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(76, 154, 153, 0.3);
        }

        @media (max-width: 768px) {
          .job-form-card {
            padding: 25px;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .action-buttons {
            flex-direction: column-reverse;
          }
        }
      `}</style>
      
      <div className="job-form-card">
        <h3 className="form-title">Create New Job</h3>
        
        <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Deep Clean for 2-bedroom apartment"
              value={jobForm.title}
              onChange={onBasicChange("title")}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Cambridge, CB2 1TN, United Kingdom"
              value={jobForm.location}
              onChange={onBasicChange("location")}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <div className="starry-input">
                <span className="icon" aria-hidden>
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
                  value={jobForm.date}
                  min={today}
                  onChange={onDateChange}
                  required
                  className="starry-control"
                />
              </div>
              <small className="hint">Past dates are disabled.</small>
            </div>
            
            <div className="form-group">
              <label>Start Time *</label>
              <div className={`starry-input ${!jobForm.date ? "is-disabled" : ""}`}>
                <span className="icon" aria-hidden>
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
                  value={jobForm.time}
                  onChange={onTimeChange}
                  min={computedMinTime}
                  step="300"
                  required
                  disabled={!jobForm.date}
                  className="starry-control"
                />
              </div>
              <small className="hint">
                {jobForm.date === today
                  ? `Earliest today: ${computedMinTime}`
                  : jobForm.date
                  ? "Pick any time."
                  : "Choose a date first."}
              </small>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Hourly Rate (£) *</label>
              <input
                type="number"
                className="form-control"
                min="0"
                step="0.01"
                placeholder="20.00"
                value={jobForm.hourly_rate}
                onChange={onBasicChange("hourly_rate")}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Hours Required *</label>
              <select
                className="form-control"
                value={jobForm.hours_required}
                onChange={onBasicChange("hours_required")}
                required
              >
                {Array.from({ length: 16 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} hour{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Services Required *</label>
            <Select
              isMulti
              options={serviceOptions}
              isLoading={servicesLoading}
              value={selectedServiceOptions}
              onChange={(vals) => dispatch(setJobServices(vals.map((v) => v.value)))}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Select one or more services"
              styles={{
                control: (base) => ({
                  ...base,
                  borderWidth: '2px',
                  borderColor: '#e4e4e4',
                  borderRadius: '10px',
                  minHeight: '48px',
                  '&:hover': {
                    borderColor: '#4C9A99'
                  }
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: 'rgba(76, 154, 153, 0.1)',
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: '#4C9A99',
                }),
              }}
            />
          </div>
          
          <div className="form-group">
            <label>Job Description *</label>
            <textarea
              className="form-control"
              placeholder="Describe the job tasks, access details, specific requirements..."
              value={jobForm.description}
              onChange={onBasicChange("description")}
              required
            />
          </div>
          
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={onBack}>
                <i className="la la-arrow-left"></i>
                Back
              </button>
              <button type="submit" className="btn btn-primary">
                Continue
                <i className="la la-arrow-right"></i>
              </button>
            </div>
        </form>
      </div>
    </>
  );
};

export default JobFormStep;