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
  console.log("🔧 Starting closeAndCleanOverlays...");
  
  try {
    // Check if Bootstrap is available
    const bs = typeof window !== "undefined" ? window.bootstrap : null;
    console.log("Bootstrap available:", !!bs);
    
    if (bs) {
      console.log("Bootstrap version:", bs?.VERSION || "unknown");
    }

    const candidateIds = [
      "loginPopupModal",
      "registerModal",
      "mobileMenu",
      "offcanvasMenu",
    ];

    console.log("Looking for elements with IDs:", candidateIds);

    candidateIds.forEach((id) => {
      const el = document.getElementById(id);
      
      if (!el) {
        console.log(`  ❌ Element #${id} not found`);
        return;
      }
      
      console.log(`  ✅ Found element #${id}, classes:`, el.className);

      // Try to close Modal
      if (bs?.Modal && el.classList.contains("modal")) {
        console.log(`    Attempting to close modal #${id}...`);
        try {
          const inst = bs.Modal.getInstance(el);
          if (inst) {
            console.log(`    Found existing Modal instance for #${id}`);
            inst.hide();
          } else {
            console.log(`    Creating new Modal instance for #${id}`);
            const newInst = new bs.Modal(el);
            newInst.hide();
          }
          console.log(`    ✅ Modal #${id} closed`);
        } catch (modalErr) {
          console.error(`    ❌ Error closing modal #${id}:`, modalErr);
        }
      }

      // Try to close Offcanvas
      if (bs?.Offcanvas && el.classList.contains("offcanvas")) {
        console.log(`    Attempting to close offcanvas #${id}...`);
        try {
          const inst = bs.Offcanvas.getInstance(el);
          if (inst) {
            console.log(`    Found existing Offcanvas instance for #${id}`);
            inst.hide();
          } else {
            console.log(`    Creating new Offcanvas instance for #${id}`);
            const newInst = new bs.Offcanvas(el);
            newInst.hide();
          }
          console.log(`    ✅ Offcanvas #${id} closed`);
        } catch (offcanvasErr) {
          console.error(`    ❌ Error closing offcanvas #${id}:`, offcanvasErr);
        }
      }
    });

    // Remove backdrop elements
    console.log("🧹 Cleaning up backdrop elements...");
    const backdrops = document.querySelectorAll(
      ".modal-backdrop, .offcanvas-backdrop, .menu-backdrop, .mmenu-backdrop, .preloader"
    );
    
    console.log(`  Found ${backdrops.length} backdrop element(s) to remove`);
    
    backdrops.forEach((n, index) => {
      console.log(`  Removing backdrop ${index + 1}:`, n.className);
      n.remove();
    });

    // Clean up body classes
    console.log("🧹 Cleaning up body classes...");
    const bodyClassesBefore = document.body.className;
    console.log("  Body classes before:", bodyClassesBefore || "(none)");
    
    document.body.classList.remove(
      "modal-open",
      "mobile-menu-visible",
      "offcanvas-open"
    );
    
    const bodyClassesAfter = document.body.className;
    console.log("  Body classes after:", bodyClassesAfter || "(none)");

    // Clean up body styles
    console.log("🧹 Cleaning up body styles...");
    const overflowBefore = document.body.style.overflow;
    const paddingRightBefore = document.body.style.paddingRight;
    console.log("  Body overflow before:", overflowBefore || "(none)");
    console.log("  Body paddingRight before:", paddingRightBefore || "(none)");
    
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("paddingRight");
    
    console.log("  Body overflow after:", document.body.style.overflow || "(none)");
    console.log("  Body paddingRight after:", document.body.style.paddingRight || "(none)");

    // Wait for next frame
    console.log("⏳ Waiting for next animation frame...");
    await new Promise((r) => requestAnimationFrame(() => {
      console.log("✅ Animation frame complete");
      r(null);
    }));
    
    console.log("✅ closeAndCleanOverlays completed successfully");
    
  } catch (error) {
    console.error("❌ Error in closeAndCleanOverlays:", error);
    console.error("  Error stack:", error.stack);
    // Don't re-throw - we want login to continue even if cleanup fails
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (isLoading) return;
  setIsLoading(true);

  try {
    // 1) attempt login
    console.log("🔐 Attempting login...");
    const loginResult = await dispatch(
      loginUser({
        email: formData.email.trim(),
        password: formData.password,
      })
    ).unwrap();
    console.log("✅ Login successful, result:", loginResult);

    // 2) fetch the current user to get role
    console.log("👤 Fetching current user...");
    let user;
    try {
      user = await dispatch(fetchCurrentUser()).unwrap();
      console.log("✅ User fetched successfully:", user);
    } catch (fetchError) {
      console.error("❌ Failed to fetch user:", fetchError);
      throw fetchError;
    }
    
    const role = user?.role;
    console.log("👤 User role:", role);
    console.log("👤 Full user object:", JSON.stringify(user, null, 2));

    // 3) toast + cleanup overlays
    toast.success("Login successful");
    console.log("🧹 Starting cleanup...");
    await closeAndCleanOverlays();
    console.log("✅ Cleanup completed");

    // 4) route by role
    console.log("🚀 Starting navigation for role:", role);
    switch (role) {
      case "Cleaner":
        console.log("➡️ Navigating to cleaner dashboard: /candidates-dashboard/dashboard");
        router.push("/candidates-dashboard/dashboard");
        console.log("✅ Navigation initiated to cleaner dashboard");
        break;
      case "Employer":
        console.log("➡️ Navigating to employer dashboard: /employers-dashboard/dashboard");
        router.push("/employers-dashboard/dashboard");
        console.log("✅ Navigation initiated to employer dashboard");
        break;
      case "Admin":
        console.log("➡️ Navigating to admin dashboard: /admin-dashboard");
        router.push("/admin-dashboard");
        console.log("✅ Navigation initiated to admin dashboard");
        break;
      default:
        console.log("⚠️ No matching role or role is undefined/null");
        console.log("➡️ Navigating to home: /");
        router.push("/");
        console.log("✅ Navigation initiated to home");
    }
    console.log("🎉 handleSubmit completed successfully");
    
  } catch (err) {
    console.error("❌ Login flow error:", err);
    console.error("Error type:", err?.constructor?.name);
    console.error("Error message:", err?.message);
    console.error("Error stack:", err?.stack);
    console.error("Full error object:", err);
    
    const msg = extractErrMsg(err);
    const friendly =
      msg === "No active account found with the given credentials"
        ? "Incorrect email or password"
        : msg;
    toast.error(friendly);
  } finally {
    console.log("🔄 Setting isLoading to false");
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
