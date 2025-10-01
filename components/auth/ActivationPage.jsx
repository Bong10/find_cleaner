// components/auth/ActivationPage.jsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser , rehydrateAuth } from "@/store/slices/authSlice";
import api from "@/utils/axiosConfig";
import { toast } from "react-toastify";

const ActivationPage = ({ params }) => {
  // Extract uid and token from catch-all params
  const [uid, token] = params.params || [];
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);

  // Memoized redirect function to avoid re-creation
  const redirectToDashboard = useCallback(() => {
    const userRole = user?.role || localStorage.getItem("user_role");
    if (userRole) {
      const roleName = String(userRole).toLowerCase();
      if (roleName === "employer") {
        router.push("/employers-dashboard/dashboard");
      } else if (roleName === "cleaner" || roleName === "candidate") {
        router.push("/candidates-dashboard/dashboard");
      } else if (roleName === "admin") {
        router.push("/admin-dashboard");
      } else {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [user, router]);

  // Activation API call
  const activateAccount = useCallback(async () => {
    try {
      const response = await api.get(`/api/users/activate/${uid}/${token}/`);
      const data = response.data;

      setStatus("success");
      setMessage(data.message || "Account activated successfully!");

      if (data.access && typeof window !== "undefined") {
        localStorage.setItem("access_token", data.access);

        await dispatch(rehydrateAuth());

        try {
          const userResult = await dispatch(fetchCurrentUser ()).unwrap();
          if (userResult?.role) {
            localStorage.setItem("user_role", userResult.role);
          }
        } catch (err) {
          console.error("Failed to fetch user data:", err);
        }
      }

      toast.success("Account activated! Welcome to TidyLinker!");
    } catch (error) {
      setStatus("error");

      let errorMessage = "Activation failed. The link may be invalid or expired.";

      if (error?.response?.status === 400) {
        errorMessage =
          error.response.data?.error ||
          error.response.data?.message ||
          "Invalid or expired activation link.";
      } else if (error?.response?.status === 404) {
        errorMessage = "Activation link not found. Please request a new one.";
      } else if (!error?.response) {
        errorMessage = "Network error. Please check your connection and try again.";
      }

      setMessage(errorMessage);
      toast.error(errorMessage);
      console.error("Activation error:", error);
    }
  }, [uid, token, dispatch]);

  // Trigger activation on mount
  useEffect(() => {
    if (uid && token) {
      activateAccount();
    } else {
      setStatus("error");
      setMessage("Invalid activation link. Missing parameters.");
    }
  }, [uid, token, activateAccount]);

  // Countdown and redirect effect
  useEffect(() => {
    if (status === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            redirectToDashboard();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, redirectToDashboard]);

  // Handlers for buttons
  const handleManualRedirect = () => redirectToDashboard();
  const handleRequestNewLink = () => router.push("/register");
  const handleGoHome = () => router.push("/");

  return (
    <div className="activation-page">
      <div className="container">
        <div className="activation-card" role="main" aria-live="polite" aria-busy={status === "loading"}>
          {/* Logo */}
          <div className="logo-section">
            <Image
              src="/images/logo.png"
              alt="TidyLinker Logo"
              width={80}
              height={80}
              priority
              style={{ width: "80px", height: "80px", objectFit: "contain" }}
            />
          </div>

          {/* Loading State */}
          {status === "loading" && (
            <section className="status-content" aria-label="Loading activation status">
              <div className="spinner-wrapper" role="status" aria-live="polite" aria-atomic="true">
                <div className="spinner"></div>
              </div>
              <h2 className="title">Activating Your Account...</h2>
              <p className="subtitle">Please wait while we verify your account.</p>
            </section>
          )}

          {/* Success State */}
          {status === "success" && (
            <section className="status-content" aria-label="Activation successful">
              <div className="icon-wrapper success" aria-hidden="true">
                <span className="icon">✓</span>
              </div>
              <h2 className="title">Account Activated!</h2>
              <p className="subtitle">{message}</p>

              {user && (
                <p className="welcome-message" tabIndex={0}>
                  Welcome, {user.name || user.email}!
                </p>
              )}

              <p className="countdown-message" aria-live="polite">
                Redirecting to your dashboard in{" "}
                <span className="countdown" aria-atomic="true" aria-live="polite">
                  {countdown}
                </span>{" "}
                seconds...
              </p>

              <button onClick={handleManualRedirect} className="btn btn-primary" aria-label="Go to dashboard now">
                Go to Dashboard Now
              </button>
            </section>
          )}

          {/* Error State */}
          {status === "error" && (
            <section className="status-content" aria-label="Activation failed">
              <div className="icon-wrapper error" aria-hidden="true">
                <span className="icon">!</span>
              </div>
              <h2 className="title">Activation Failed</h2>
              <p className="error-message">{message}</p>

              <div className="button-group">
                <button onClick={handleRequestNewLink} className="btn btn-primary" aria-label="Request new activation link">
                  Request New Link
                </button>
                <button onClick={handleGoHome} className="btn btn-secondary" aria-label="Go to home page">
                  Go to Home
                </button>
              </div>

              <div className="help-text">
                <p>
                  Need help? Contact our support team at{" "}
                  <a href="mailto:support@tidylinker.com" className="support-link">
                    support@tidylinker.com
                  </a>
                </p>
              </div>
            </section>
          )}
        </div>
      </div>

      <style jsx>{`
        .activation-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #4b9b97 0%, #3d7d7a 100%);
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
            Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        }

        .container {
          width: 100%;
          max-width: 480px;
        }

        .activation-card {
          background: white;
          border-radius: 16px;
          padding: 48px 40px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          transition: box-shadow 0.3s ease;
        }
        .activation-card:focus-within {
          box-shadow: 0 0 0 3px #2aa389;
          outline: none;
        }

        .logo-section {
          margin-bottom: 32px;
        }

        .status-content {
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .spinner-wrapper {
          margin: 32px auto;
          width: 60px;
          height: 60px;
        }

        .spinner {
          width: 100%;
          height: 100%;
          border: 4px solid #f0f0f0;
          border-top: 4px solid #2aa389;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .icon-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .icon-wrapper.success {
          background: linear-gradient(135deg, #2aa389 0%, #3bc4a8 100%);
          box-shadow: 0 0 15px #2aa389;
        }

        .icon-wrapper.error {
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
          box-shadow: 0 0 15px #ff6b6b;
        }

        .icon {
          font-size: 40px;
          color: white;
          font-weight: 700;
          user-select: none;
        }

        .title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 12px;
        }

        .subtitle {
          font-size: 16px;
          color: #6b7280;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .welcome-message {
          font-size: 18px;
          color: #2aa389;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .countdown-message {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 24px;
        }

        .countdown {
          font-weight: 700;
          color: #2aa389;
          font-size: 18px;
        }

        .error-message {
          font-size: 16px;
          color: #dc2626;
          margin-bottom: 32px;
          line-height: 1.5;
        }

        .btn {
          padding: 14px 32px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          outline: none;
          user-select: none;
          box-shadow: 0 4px 12px rgba(42, 163, 137, 0.3);
        }

        .btn-primary {
          background: linear-gradient(135deg, #2aa389 0%, #3bc4a8 100%);
          color: white;
        }

        .btn-primary:hover,
        .btn-primary:focus-visible {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(42, 163, 137, 0.5);
          outline-offset: 2px;
          outline: 2px solid #239177;
        }

        .btn-secondary {
          background: transparent;
          color: #2aa389;
          border: 2px solid #2aa389;
        }

        .btn-secondary:hover,
        .btn-secondary:focus-visible {
          background: #2aa389;
          color: white;
          outline-offset: 2px;
          outline: 2px solid #239177;
        }

        .button-group {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .help-text {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
          font-size: 13px;
          color: #9ca3af;
        }

        .help-text a.support-link {
          color: #2aa389;
          text-decoration: none;
          font-weight: 600;
        }

        .help-text a.support-link:hover,
        .help-text a.support-link:focus-visible {
          text-decoration: underline;
          outline-offset: 2px;
          outline: 2px solid #239177;
        }

        @media (max-width: 480px) {
          .activation-card {
            padding: 32px 20px;
          }

          .title {
            font-size: 24px;
          }

          .button-group {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ActivationPage;
