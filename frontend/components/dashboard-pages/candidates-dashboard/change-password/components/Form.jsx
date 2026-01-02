"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { changePassword } from "@/services/authService";

/* --------- tiny helpers --------- */
const capsOn = (e) => e.getModifierState && e.getModifierState("CapsLock");

function strengthInfo(pw) {
  // simple, fast scoring: 0..4
  let score = 0;
  if (!pw) return { score: 0, label: "Too weak" };
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;

  const label =
    score <= 1 ? "Weak" : score === 2 ? "Okay" : score === 3 ? "Strong" : "Very strong";
  return { score, label };
}

export default function Form() {
  const [submitting, setSubmitting] = useState(false);

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [caps, setCaps] = useState({ cur: false, new: false, conf: false });

  const [fieldErr, setFieldErr] = useState({
    current_password: "",
    new_password: "",
    re_new_password: "",
    non_field: "",
  });

  const newInputRef = useRef(null);

  useEffect(() => {
    // autofocus on new password for convenience
    newInputRef.current?.focus();
  }, []);

  const strength = useMemo(() => strengthInfo(next), [next]);
  const passwordsMatch = next && confirm && next === confirm;

  const canSubmit =
    current.trim().length > 0 &&
    next.trim().length >= 8 &&
    passwordsMatch &&
    !submitting;

  const onSubmit = async (e) => {
    e.preventDefault();
    // reset inline errors
    setFieldErr({ current_password: "", new_password: "", re_new_password: "", non_field: "" });

    if (!current.trim() || !next.trim() || !confirm.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (next.trim().length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      toast.error("New password and confirmation do not match.");
      return;
    }
    if (current === next) {
      toast.error("New password must be different from current password.");
      return;
    }

    try {
      setSubmitting(true);
      toast.info("Updating password…");
      await changePassword(current, next, confirm);
      toast.success("Password updated successfully.");
      setCurrent("");
      setNext("");
      setConfirm("");
      setShowCur(false);
      setShowNew(false);
      setShowConfirm(false);
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === "object") {
        const nextErr = { current_password: "", new_password: "", re_new_password: "", non_field: "" };
        Object.entries(data).forEach(([field, msgs]) => {
          const msg = Array.isArray(msgs) ? msgs[0] : String(msgs);
          if (field === "detail" || field === "non_field_errors") {
            nextErr.non_field = msg;
            toast.error(msg);
          } else if (field in nextErr) {
            nextErr[field] = msg;
            toast.error(`${field}: ${msg}`);
          } else {
            toast.error(String(msg));
          }
        });
        setFieldErr(nextErr);
      } else {
        toast.error(err?.message || "Failed to update password.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="default-form" onSubmit={onSubmit}>
      <div className="pw-card">
        <div className="pw-head">
          <h4>Change Password</h4>
          <p>Choose a strong password you won’t reuse anywhere else.</p>
        </div>

        {/* Current password */}
        <div className="pw-row">
          <label className="pw-label">Current password</label>
          <div className={`pw-input ${fieldErr.current_password ? "has-error" : ""}`}>
            <input
              type={showCur ? "text" : "password"}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              onKeyUp={(e) => setCaps((c) => ({ ...c, cur: capsOn(e) }))} // Caps Lock hint
              placeholder="Enter your current password"
              aria-invalid={!!fieldErr.current_password}
              aria-describedby="current-help"
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowCur((s) => !s)}
              aria-label={showCur ? "Hide current password" : "Show current password"}
            >
              <span className={`la ${showCur ? "la-eye-slash" : "la-eye"}`} />
            </button>
          </div>
          <div className="pw-help" id="current-help">
            {caps.cur && <span className="caps">Caps Lock is ON</span>}
            {fieldErr.current_password && (
              <span className="err">{fieldErr.current_password}</span>
            )}
          </div>
        </div>

        {/* New password */}
        <div className="pw-row">
          <label className="pw-label">New password</label>
          <div className={`pw-input ${fieldErr.new_password ? "has-error" : ""}`}>
            <input
              ref={newInputRef}
              type={showNew ? "text" : "password"}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              onKeyUp={(e) => setCaps((c) => ({ ...c, new: capsOn(e) }))} // Caps Lock hint
              placeholder="Minimum 8 characters"
              aria-invalid={!!fieldErr.new_password}
              aria-describedby="new-help"
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowNew((s) => !s)}
              aria-label={showNew ? "Hide new password" : "Show new password"}
            >
              <span className={`la ${showNew ? "la-eye-slash" : "la-eye"}`} />
            </button>
          </div>

          {/* strength meter */}
          <div className="pw-strength">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`bar ${strength.score > i ? "on" : ""}`} />
            ))}
            <span className="label">{strength.label}</span>
          </div>

          <div className="pw-help" id="new-help">
            {caps.new && <span className="caps">Caps Lock is ON</span>}
            {fieldErr.new_password && <span className="err">{fieldErr.new_password}</span>}
          </div>
        </div>

        {/* Confirm */}
        <div className="pw-row">
          <label className="pw-label">Confirm new password</label>
          <div className={`pw-input ${fieldErr.re_new_password ? "has-error" : ""}`}>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onKeyUp={(e) => setCaps((c) => ({ ...c, conf: capsOn(e) }))} // Caps Lock hint
              placeholder="Re-enter your new password"
              aria-invalid={!!fieldErr.re_new_password}
              aria-describedby="confirm-help"
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowConfirm((s) => !s)}
              aria-label={showConfirm ? "Hide confirmation" : "Show confirmation"}
            >
              <span className={`la ${showConfirm ? "la-eye-slash" : "la-eye"}`} />
            </button>
          </div>
          <div className="pw-help" id="confirm-help">
            {!passwordsMatch && confirm && (
              <span className="err">Passwords do not match.</span>
            )}
            {caps.conf && <span className="caps">Caps Lock is ON</span>}
            {fieldErr.re_new_password && (
              <span className="err">{fieldErr.re_new_password}</span>
            )}
            {fieldErr.non_field && <span className="err">{fieldErr.non_field}</span>}
          </div>
        </div>

        {/* Submit */}
        <div className="pw-actions">
          <button type="submit" className="theme-btn btn-style-one" disabled={!canSubmit}>
            {submitting ? "Updating…" : "Update password"}
          </button>
        </div>
      </div>

      {/* Scoped styles – premium look without altering your global theme */}
      <style jsx>{`
        .pw-card {
          border: 1px solid #eef0f4;
          border-radius: 16px;
          padding: 20px 22px;
          background:
            radial-gradient(1600px 200px at -10% -20%, #ffffff, #fafafa 70%),
            linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
          box-shadow: 0 12px 36px rgba(15, 23, 42, 0.06);
          max-width: 720px;
        }
        .pw-head h4 { margin: 0 0 4px; font-weight: 700; }
        .pw-head p { margin: 0 0 14px; color: #6b7280; }

        .pw-row { margin-bottom: 14px; }
        .pw-label { font-weight: 600; margin-bottom: 6px; display: block; }

        .pw-input {
          position: relative;
          display: flex;
          align-items: center;
          border: 1px solid #e7e7e7;
          border-radius: 12px;
          background: #fff;
          transition: box-shadow .25s ease, border-color .25s ease;
        }
        .pw-input input {
          width: 100%;
          height: 50px;
          padding: 0 46px 0 14px;
          border: none;
          outline: none;
          background: transparent;
          font-size: 15px;
        }
        .pw-input:focus-within {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
        }
        .pw-input.has-error { border-color: #f87171; }
        .pw-input.has-error:focus-within { box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.18); }

        .pw-toggle {
          position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
          width: 38px; height: 38px; border: none; background: transparent; border-radius: 8px;
          display: grid; place-items: center; cursor: pointer; color: #6b7280;
        }
        .pw-toggle:hover { background: #f3f4f6; color: #111827; }

        .pw-help {
          display: flex; gap: 14px; margin-top: 6px; min-height: 20px;
          font-size: 12px; color: #6b7280; align-items: center; flex-wrap: wrap;
        }
        .pw-help .err { color: #b91c1c; }
        .pw-help .caps { color: #b45309; }

        .pw-strength {
          display: flex; align-items: center; gap: 6px; margin-top: 8px; margin-bottom: 4px;
        }
        .pw-strength .bar { width: 56px; height: 6px; border-radius: 999px; background: #e5e7eb; }
        .pw-strength .bar.on:nth-child(1) { background: #f59e0b; }
        .pw-strength .bar.on:nth-child(2) { background: #f59e0b; }
        .pw-strength .bar.on:nth-child(3) { background: #10b981; }
        .pw-strength .bar.on:nth-child(4) { background: #22c55e; }
        .pw-strength .label { font-size: 12px; color: #6b7280; margin-left: 4px; }

        .pw-actions { margin-top: 8px; display: flex; gap: 10px; }
        @media (max-width: 576px) {
          .pw-card { padding: 16px; }
          .pw-input input { height: 46px; }
        }
      `}</style>
    </form>
  );
}
