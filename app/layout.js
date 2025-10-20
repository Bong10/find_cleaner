"use client";
import Aos from "aos";
import "aos/dist/aos.css";
import "../styles/index.scss";
import { useEffect } from "react";
import ScrollToTop from "../components/common/ScrollTop";
import { Provider } from "react-redux";
import { store } from "../store/store";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// Import the new Preloader component
import Preloader from "../components/common/Preloader.jsx";

// Auth gate component
import { useDispatch, useSelector } from "react-redux";
import { bootstrapAuth, performLogout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

function AuthGate({ children }) {
  const dispatch = useDispatch();
  const bootstrapping = useSelector((s) => s.auth.bootstrapping);
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    dispatch(bootstrapAuth());
  }, [dispatch]);

  // Listen for forced logout signals from axios interceptor (refresh failure)
  useEffect(() => {
    const onForceLogout = () => {
      dispatch(performLogout());
      router.push("/login");
    };
    window.addEventListener("auth:force-logout", onForceLogout);
    const storageListener = (e) => {
      if (e.key === "auth_force_logout") onForceLogout();
    };
    window.addEventListener("storage", storageListener);
    return () => {
      window.removeEventListener("auth:force-logout", onForceLogout);
      window.removeEventListener("storage", storageListener);
    };
  }, [dispatch, router]);

  if (bootstrapping) {
    return <Preloader />;
  }
  
  return children;
}

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

export default function RootLayout({ children }) {
  useEffect(() => {
    Aos.init({ duration: 1400, once: true });
  }, []);

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="keywords"
          content="candidates, career, employment, job board, job listing, job portal, job search, recruiters, recruitment, resume"
        />
        <meta name="description" content="TidyLinking - Connecting Cleaners with Opportunities" />
        <meta name="ibthemes" content="ATFN" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Provider store={store}>
          <AuthGate>
            <div className="page-wrapper">
              {children}
              <ToastContainer
                position="bottom-right"
                autoClose={8000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
              <ScrollToTop />
            </div>
          </AuthGate>
        </Provider>
      </body>
    </html>
  );
}