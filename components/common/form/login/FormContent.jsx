"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LoginWithSocial from "./LoginWithSocial";
import { loginUser, fetchCurrentUser } from "@/store/slices/authSlice";

/** Gracefully extract a user-friendly error message from RTK/axios/DRF/Djoser shapes */
const extractErrMsg = (err) => {
  if (!err) return "Login failed";
  if (typeof err === "string") return err;

  // RTK unwrap() often passes the payload, axios errors have response.data
  const data = err?.response?.data || err;

  if (typeof data?.detail === "string") return data.detail;
  if (Array.isArray(data?.non_field_errors) && data.non_field_errors[0]) {
    return String(data.non_field_errors[0]);
  }
  if (typeof data?.message === "string") return data.message;

  // Field errors
  for (const k of ["email", "password"]) {
    if (Array.isArray(data?.[k]) && data[k][0]) return String(data[k][0]);
  }

  return err?.message || "Login failed";
};

const FormContent = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const closeAndCleanOverlays = async () => {
    try {
      const bs = typeof window !== "undefined" ? window.bootstrap : null;

      const candidateIds = [
        "loginPopupModal",
        "registerModal",
        "mobileMenu",
        "offcanvasMenu",
      ];

      candidateIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        if (bs?.Modal && el.classList.contains("modal")) {
          const inst = bs.Modal.getInstance(el) || new bs.Modal(el);
          if (inst.hide) inst.hide();
        }

        if (bs?.Offcanvas && el.classList.contains("offcanvas")) {
          const inst = bs.Offcanvas.getInstance(el) || new bs.Offcanvas(el);
          if (inst.hide) inst.hide();
        }
      });

      document
        .querySelectorAll(
          ".modal-backdrop, .offcanvas-backdrop, .menu-backdrop, .mmenu-backdrop, .preloader"
        )
        .forEach((n) => n.remove());

      document.body.classList.remove(
        "modal-open",
        "mobile-menu-visible",
        "offcanvas-open"
      );
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("paddingRight");

      await new Promise((r) => requestAnimationFrame(() => r(null)));
    } catch {
      // ignore cleanup errors
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; // guard double-submits
    setIsLoading(true);

    try {
      // 1) attempt login
      await dispatch(
        loginUser({
          email: formData.email.trim(),
          password: formData.password,
        })
      ).unwrap();

      // 2) fetch the current user to get role
      const user = await dispatch(fetchCurrentUser()).unwrap();
      const role = user?.role;

      // 3) toast + cleanup overlays
      toast.success("Login successful");
      await closeAndCleanOverlays();

      // 4) route by role
      switch (role) {
        case "cleaner":
          router.push("/candidates-dashboard/dashboard");
          break;
        case "employer":
          router.push("/employers-dashboard/dashboard");
          break;
        case "admin":
          router.push("/admin-dashboard");
          break;
        default:
          router.push("/");
      }
    } catch (err) {
      const msg = extractErrMsg(err);
      const friendly =
        msg === "No active account found with the given credentials"
          ? "Incorrect email or password"
          : msg;
      toast.error(friendly);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-inner">
      <h3>Login to TidyLinker</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            disabled={isLoading}
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            disabled={isLoading}
            autoComplete="current-password"
          />
        </div>

        <div className="form-group">
          <button
            className="theme-btn btn-style-one"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </div>
      </form>

      <div className="bottom-box">
        <div className="text">
          Don’t have an account?{" "}
          <Link
            href="#"
            className="call-modal signup"
            data-bs-toggle="modal"
            data-bs-target="#registerModal"
          >
            Signup
          </Link>
        </div>
        <div className="divider">
          <span>or</span>
        </div>
        <LoginWithSocial />
      </div>
    </div>
  );
};

export default FormContent;
