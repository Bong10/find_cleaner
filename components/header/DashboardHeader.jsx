// components/header/DashboardHeader.jsx
'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import employerMenuData from "../../data/employerMenuData";
import HeaderNavContent from "./HeaderNavContent";
import { isActiveLink } from "../../utils/linkActiveChecker";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { performLogout } from "@/store/slices/authSlice";
import ConfirmModal from "@/components/common/ConfirmModal";
import {
  fetchNotificationsUnreadCount,
  selectNotificationsUnreadCount,
} from "@/store/slices/notificationsSlice";

// resolve relative media paths against your API base (if backend returns "/media/..")
const API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL
    ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "")
    : "") || "";

const resolveMediaUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
};

const DashboardHeader = () => {
  const [navbar, setNavbar] = useState(false);
  const dispatch = useDispatch();
  const pathname = usePathname();

  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const unreadNotifs = useSelector(selectNotificationsUnreadCount) || 0;

  useEffect(() => {
    const changeBackground = () => setNavbar(window.scrollY >= 0);
    changeBackground();
    window.addEventListener("scroll", changeBackground);
    return () => window.removeEventListener("scroll", changeBackground);
  }, []);

  // keep unread notification count fresh in header
  useEffect(() => {
    let timer;
    dispatch(fetchNotificationsUnreadCount());
    timer = setInterval(() => dispatch(fetchNotificationsUnreadCount()), 15000);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [dispatch]);

  // avatar from backend (fallback to your current placeholder)
  let avatarSrc = "/images/resource/company-6.png";
  if (user?.profile_picture) {
    const abs = resolveMediaUrl(user.profile_picture);
    if (abs) avatarSrc = abs;
  }

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    setShowLogoutConfirm(false);
    try {
      await dispatch(performLogout());
    } finally {
      if (typeof window !== "undefined") window.location.replace("/login");
    }
  };

  return (
    <>
    {/* Main Header */}
    <header className={`main-header header-shaddow  ${navbar ? "fixed-header " : ""}`}>
      <div className="container-fluid">
        {/* <!-- Main box --> */}
        <div className="main-box">
          {/* Logo - Left Side */}
          <div className="logo-box">
            <div className="logo">
              <Link href="/">
                <Image
                  alt="brand"
                  src="/images/logo.png"
                  width={50}
                  height={30}
                  priority
                />
              </Link>
            </div>
          </div>
          {/* End .logo-box */}

          {/* Centered Navigation */}
          <div className="nav-center">
            <HeaderNavContent />
          </div>
          {/* <!-- Main Menu End--> */}

          {/* Right Side Actions */}
          <div className="outer-box">
            <button className="menu-btn">
              <span className="count">1</span>
              <span className="icon la la-heart-o"></span>
            </button>
            {/* wishlisted menu */}

            <Link href="/employers-dashboard/resume-alerts" className="menu-btn" aria-label="Notifications">
              {unreadNotifs > 0 && <span className="count badge-circle">{unreadNotifs}</span>}
              <span className="icon la la-bell"></span>
            </Link>
            {/* End notification-icon */}

            {/* <!-- Dashboard Option --> */}
            <div className="dropdown dashboard-option">
              <a
                className="dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <Image
                  alt="avatar"
                  className="thumb"
                  src={avatarSrc}
                  width={50}
                  height={50}
                />
                <span className="name">My Account</span>
              </a>

              <ul className="dropdown-menu">
                {employerMenuData.map((item) => {
                  const isActive = isActiveLink(item.routePath, pathname);
                  const isLogout = item.name === "Logout" || item.id === 11;

                  return (
                    <li className={`${isActive ? "active" : ""} mb-1`} key={item.id}>
                      {/* Keep Link markup; intercept click for Logout only */}
                      <Link
                        href={item.routePath}
                        onClick={isLogout ? handleLogoutClick : undefined}
                      >
                        <i className={`la ${item.icon}`}></i>{" "}
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            {/* End dropdown */}
          </div>
          {/* End outer-box */}
        </div>
      </div>

      <style jsx>{`
        .main-header .main-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          width: 100%;
        }

        .logo-box {
          flex: 0 0 auto;
          min-width: 150px;
        }

        .nav-center {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 20px;
        }

        .outer-box {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 15px;
          min-width: 150px;
          justify-content: flex-end;
        }

        /* Centered numeric badge inside bell */
        .menu-btn { position: relative; display: inline-flex; align-items: center; justify-content: center; }
        .badge-circle {
          position: absolute;
          top: -6px;
          right: -6px;
          min-width: 18px;
          height: 18px;
          padding: 0 4px;
          border-radius: 999px;
          background: #ff3b30;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        /* Responsive */
        @media (max-width: 991px) {
          .main-header .main-box {
            flex-wrap: wrap;
          }
          
          .nav-center {
            order: 3;
            width: 100%;
            margin-top: 15px;
          }
        }
      `}</style>
    </header>
      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => !isLoggingOut && setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You'll need to sign in again to access your dashboard."
        confirmText={isLoggingOut ? "Logging out..." : "Yes, Logout"}
        cancelText="Cancel"
        confirmStyle="primary"
        icon="la-sign-out-alt"
      />
    </>
  );
};

export default DashboardHeader;