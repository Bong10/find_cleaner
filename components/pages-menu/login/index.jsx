"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

// import FormContent2 from "../../common/form/login/FormContent2";
import FormContent from "../../common/form/login/FormContent";
import MobileMenu from "../../header/MobileMenu";
import Header from "./Header";

const roleToDashboard = (role) => {
  switch (role) {
    case "employer":
      return "/employers-dashboard/dashboard";
    case "cleaner":
      return "/candidates-dashboard/dashboard"; // adjust if your cleaner path differs
    case "admin":
      return "/admin/dashboard"; // adjust if you have an admin UI
    default:
      return "/"; // fallback
  }
};

const Index = () => {
  const router = useRouter();
  const { isAuthenticated, role, user } = useSelector((s) => s.auth || {});
  const effectiveRole = role || user?.role;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isAuthenticated) {
      router.replace(roleToDashboard(effectiveRole));
    }
  }, [mounted, isAuthenticated, effectiveRole, router]);

  // While deciding / redirecting, render nothing to avoid flicker
  if (!mounted) return null;
  if (isAuthenticated) return null;

  return (
    <>
      <Header />
      {/* <!--End Main Header -->  */}

      <MobileMenu />
      {/* End MobileMenu */}

      <div className="login-section">
        <div
          className="image-layer"
          style={{ backgroundImage: "url(/images/background/12.jpg)" }}
        ></div>
        <div className="outer-box">
          {/* <!-- Login Form --> */}
          <div className="login-form default-form">
            <FormContent signupVariant="route" resetVariant="route" />
          </div>
          {/* <!--End Login Form --> */}
        </div>
      </div>
      {/* <!-- End Info Section --> */}
    </>
  );
};

export default Index;
