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
import candidatesMenuData from "../../data/candidatesMenuData";
import { isActiveLink } from "../../utils/linkActiveChecker";

const DefaulHeader2 = () => {
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
    window.location.replace("/");
  };

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

  const roleName = String(user?.role || "").toLowerCase();
  const isCandidate = roleName === "candidate" || roleName === "cleaner";
  const menuData = isCandidate ? candidatesMenuData : employerMenuData;

  let avatarSrc = "/images/resource/avatar-1.jpg";
  if (user?.profile_picture) {
    avatarSrc = user.profile_picture;
  }

  if (!isClient) return null;

  return (
    <header
      className={`main-header ${
        !navbar ? "-type-12" : ""
      } ${
        navbar ? "fixed-header animated slideInDown" : ""
      }`}
    >
      <div className="main-box">
        {/* Logo section */}
        <div className="logo-box">
          <div className="logo">
            <Link href={isAuthenticated ? getDashboardRoute() : "/"}>
              <Image
                width={51}
                height={46}
                style={{
                    width: '51px',
                    height: '46px',
                  }}
                src="/images/logo.png"
                alt="brand"
              /> <span className="logo-text">TidyLinker</span>
            </Link>
          </div>
        </div>

        {/* Centered navigation */}
        <div className="nav-outer">
          <HeaderNavContent />
        </div>

        {/* Right section */}
        <div className="outer-box">
          {isAuthenticated && user ? (
            // ==== Authenticated user controls ====
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
                  className="dropdown-toggle logo"
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
            // ==== Public user controls ====
            <div className="public-controls">
              {/* Login/Signup button */}
              <a
                href="#"
                className="login-signup-btn"
                data-bs-toggle="modal"
                data-bs-target="#loginPopupModal"
              >
                Login / Signup
              </a>

              {/* Language selector */}
              <button className="icon-btn language-btn">
                <span className="icon la la-globe"></span>
              </button>

              {/* User dropdown for public visitors */}
              <div className="dropdown user-dropdown">
                <button
                  className="icon-btn user-btn dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="icon la la-user"></span>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link href="/register?type=cleaner" className="dropdown-item">
                      <i className="la la-broom"></i> Become a Cleaner
                    </Link>
                  </li>
                  <li>
                    <Link href="/register?type=employer" className="dropdown-item">
                      <i className="la la-briefcase"></i> Become an Employer
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link href="/about" className="dropdown-item">
                      <i className="la la-info-circle"></i> About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/help" className="dropdown-item">
                      <i className="la la-question-circle"></i> Help Center
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .-type-12 {
          background: #FFFFFF;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          position: relative;
          top: 0;
          z-index: 100;
        }

        .logo-text {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--text-primary);
        }
        
        .main-box {
          max-width: 1380px;
          margin: 0 auto;
          padding: 0rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
        }

        .logo-box {
          flex: 0 0 auto;
        }

        .logo img {
              max-width: 51px;
              height: 46px;
        }
        
        .logo {
          display: flex;
          align-items: center;
        }

        .nav-outer {
          flex: 1;
          display: flex;
          justify-content: center;
          padding: 0 2rem;
        }
        
        .outer-box {
          flex: 0 0 auto;
        }

        .public-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .login-signup-btn {
          padding: 8px 20px;
          background: transparent;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          color: #6B7280;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .login-signup-btn:hover {
          background: #F9FAFB;
          color: #111827;
          border-color: #D1D5DB;
        }
        
        .icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: #F3F4F6;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #6B7280;
          transition: all 0.3s ease;
        }
        
        .icon-btn:hover {
          background: #E5E7EB;
          color: #374151;
        }

        .icon-btn .icon {
          font-size: 18px;
        }

        .user-dropdown {
          position: relative;
        }

        @media (max-width: 768px) {
          .main-box {
            padding: 0.75rem 1rem;
          }
          
          .nav-outer {
            display: none;
          }

          .login-signup-btn {
            padding: 6px 12px;
            font-size: 13px;
          }
        }
      `}</style>

      <style jsx>{`
        :global(.auth-actions .icon) {
          color: #2aa389 !important;
        }

        :global(.auth-actions .name) {
          color: #111827 !important;
        }

        :global(.auth-actions .count) {
          color: white !important;
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
          width: 40px !important;
          height: 36px !important;
          border-radius: 999px !important;
          object-fit: cover !important;
          transform: none !important;
          border: 2px solid rgba(255, 255, 255, 0.9);
          background: #2aa389;
          display: inline-block;
        }

        :global(.user-dropdown .dropdown-menu) {
          border: none;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          padding: 8px 0;
          margin-top: 8px;
        }

        :global(.user-dropdown .dropdown-item) {
          padding: 8px 16px;
          color: #6B7280;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        :global(.user-dropdown .dropdown-item:hover) {
          background: #F3F4F6;
          color: #111827;
        }

        :global(.user-dropdown .dropdown-item i) {
          margin-right: 8px;
          width: 16px;
        }

        :global(.user-dropdown .dropdown-divider) {
          margin: 4px 0;
        }
        
        .header-span {
           display: none !important;
        }
      `}</style>
    </header>
  );
};

export default DefaulHeader2;
;