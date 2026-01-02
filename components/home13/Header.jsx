// components/header/Header.jsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderNavContent from "../header/HeaderNavContent";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { performLogout } from "@/store/slices/authSlice";
import { useRouter, usePathname } from "next/navigation";
import employerMenuData from "../../data/employerMenuData";
import candidatesMenuData from "../../data/candidatesMenuData"; // ✅ added
import { isActiveLink } from "../../utils/linkActiveChecker";

const Header = () => {
  const [navbar, setNavbar] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const changeBackground = () => {
    setNavbar(window.scrollY >= 10);
  };

  useEffect(() => {
    setIsClient(true);
    window.addEventListener("scroll", changeBackground);
    return () => window.removeEventListener("scroll", changeBackground);
  }, []);

  const handleLogout = async () => {
    await dispatch(performLogout());
    window.location.replace("/"); // hard reload & replace history (kept)
  };

  // Intercept only the Logout item in the dropdown
  const handleLogoutClick = async (e) => {
    e.preventDefault();
    await handleLogout();
  };

  const getDashboardRoute = () => {
    if (!user?.role) return "/";
    const roleName = String(user.role).toLowerCase();
    if (roleName === "cleaner" || roleName === "candidate")
      return "/candidates-dashboard/dashboard";
    if (roleName === "employer") return "/employers-dashboard/dashboard";
    if (roleName === "admin") return "/admin-dashboard";
    return "/";
  };

  // ✅ menu selection based on role (candidate/cleaner → candidatesMenuData)
  const roleName = String(user?.role || "").toLowerCase();
  const isCandidate = roleName === "candidate" || roleName === "cleaner";
  const menuData = isCandidate ? candidatesMenuData : employerMenuData;

  let avatarSrc = "/images/resource/avatar-1.jpg";
  if (user?.profile_picture) {
    avatarSrc = user.profile_picture; // use backend image as-is
  }

  if (!isClient) return null;

  return (
    <header
      className={`main-header -type-11 ${
        navbar ? "fixed-header animated slideInDown" : ""
      }`}
    >
      <div className="main-box">
        <div className="nav-outer">
          <div className="logo-box">
            <div className="logo">
              <Link href={isAuthenticated ? getDashboardRoute() : "/"}>
                <Image
                  width={154}
                  height={50}
                  src="/images/logo.svg"
                  alt="brand"
                />
              </Link>
            </div>
          </div>
          <HeaderNavContent />
        </div>

        <div className="outer-box">
          {isAuthenticated && user ? (
            // ==== Dashboard-style controls (icons + avatar dropdown) ====
            <>
              <button className="menu-btn auth-actions">
                <span className="count">1</span>
                <span className="icon la la-heart-o"></span>
              </button>

              <button className="menu-btn auth-actions">
                <span className="icon la la-bell"></span>
              </button>

              <div className="dropdown dashboard-option auth-actions">
                <a
                  className="dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <Image
                    alt="avatar"
                    className="thumb avatar-thumb"
                    src={avatarSrc}
                    width={40}
                    height={40}
                  />
                  <span className="name">My Account</span>
                </a>

                <ul className="dropdown-menu">
                  {menuData.map((item) => {
                    const active = isActiveLink(item.routePath, pathname);
                    const isLogout = item.name === "Logout" || item.id === 11;

                    return (
                      <li className={`${active ? "active" : ""} mb-1`} key={item.id}>
                        <Link
                          href={isLogout ? "#" : item.routePath}
                          onClick={isLogout ? handleLogoutClick : undefined}
                        >
                          <i className={`la ${item.icon}`}></i> {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          ) : (
            // ==== Public buttons (unchanged) ====
            <div className="btn-box d-flex align-items-center gap-3">
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
            </div>
          )}
        </div>
      </div>

      {/* ==== Scoped tweaks: make ONLY this section white & fix avatar ==== */}
      <style jsx>{`
        :global(.auth-actions .icon),
        :global(.auth-actions .name) {
          color: #ffffff !important;
        }
        :global(.auth-actions .count) {
          color: #ffffff !important;
          background: #3b82f6;
          border-radius: 999px;
          font-size: 11px;
          line-height: 16px;
          min-width: 16px;
          height: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transform: translate(6px, -6px);
        }
        :global(.auth-actions .avatar-thumb) {
          width: 90px !important;
          height: 36px !important;
          border-radius: 999px !important;
          object-fit: cover !important;
          transform: none !important;
          border: 2px solid rgba(255, 255, 255, 0.9);
          background: #ffffff;
          display: inline-block;
        }
      `}</style>
    </header>
  );
};

export default Header;
