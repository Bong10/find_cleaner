'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderNavContent from "../header/HeaderNavContent";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";

const Header = () => {
  const [navbar, setNavbar] = useState(false);
  const [isClient, setIsClient] = useState(false); // for hydration fix
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector(state => state.auth);

  console.log("🟦 Header render - isAuthenticated:", isAuthenticated);
  console.log("🟩 User:", user);

  const changeBackground = () => {
    setNavbar(window.scrollY >= 10);
  };

  useEffect(() => {
    setIsClient(true); // client-only flag
    window.addEventListener("scroll", changeBackground);
    return () => window.removeEventListener("scroll", changeBackground);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  const getDashboardRoute = () => {
    if (!user?.role) return "/";
    const roleName = user.role.toLowerCase();
    if (roleName === "cleaner") return "/candidates-dashboard/dashboard";
    if (roleName === "employer") return "/employers-dashboard/dashboard";
    if (roleName === "admin") return "/admin-dashboard";
    return "/";
  };

  // Image Fallback
  let avatarSrc = "/images/resource/avatar-1.jpg";
  if (user?.profile_picture?.startsWith("http")) {
    avatarSrc = user.profile_picture;
  }

  if (!isClient) return null;

  return (
    <header
      className={`main-header -type-11 ${navbar ? "fixed-header animated slideInDown" : ""}`}
    >
      <div className="main-box">
        <div className="nav-outer">
          <div className="logo-box">
            <div className="logo">
              <Link href="/">
                <Image width={154} height={50} src="/images/logo.svg" alt="brand" />
              </Link>
            </div>
          </div>
          <HeaderNavContent />
        </div>

        <div className="outer-box">
          <div className="btn-box d-flex align-items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <Link href={getDashboardRoute()} className="theme-btn btn-style-three btn-white-10">
                  Dashboard
                </Link>
                <div className="profile-info d-flex align-items-center gap-2">
                  <Image
                    src={avatarSrc}
                    width={40}
                    height={40}
                    className="rounded-circle"
                    alt="Profile"
                  />
                  <span className="fw-bold text-white">{user.name?.split(' ')[0]}</span>
                </div>
                <button
                  className="theme-btn btn-style-one btn-white"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="#"
                  className="theme-btn btn-style-three btn-white-10 call-modal"
                  data-bs-toggle="modal"
                  data-bs-target="#loginPopupModal"
                >
                  Login / Register
                </a>
                <Link
                  href="/employers-dashboard/post-jobs"
                  className="theme-btn btn-style-one btn-white"
                >
                  Post a Job
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
