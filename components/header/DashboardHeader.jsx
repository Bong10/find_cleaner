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

  useEffect(() => {
    const changeBackground = () => setNavbar(window.scrollY >= 0);
    changeBackground();
    window.addEventListener("scroll", changeBackground);
    return () => window.removeEventListener("scroll", changeBackground);
  }, []);

  // avatar from backend (fallback to your current placeholder)
  let avatarSrc = "/images/resource/company-6.png";
  if (user?.profile_picture) {
    const abs = resolveMediaUrl(user.profile_picture);
    if (abs) avatarSrc = abs;
  }

  const handleLogoutClick = async (e) => {
    // Intercept ONLY the Logout item click
    e.preventDefault();
    try {
      await dispatch(performLogout());
    } finally {
      if (typeof window !== "undefined") window.location.replace("/");
    }
  };

  return (
    // <!-- Main Header-->
    <header className={`main-header header-shaddow  ${navbar ? "fixed-header " : ""}`}>
      <div className="container-fluid">
        {/* <!-- Main box --> */}
        <div className="main-box">
          {/* <!--Nav Outer --> */}
          <div className="nav-outer">
            <div className="logo-box">
              <div className="logo">
                <Link href="/">
                  <Image
                    alt="brand"
                    src="/images/logo-white.svg"
                    width={154}
                    height={50}
                    priority
                  />
                </Link>
              </div>
            </div>
            {/* End .logo-box */}

            <HeaderNavContent />
            {/* <!-- Main Menu End--> */}
          </div>
          {/* End .nav-outer */}

          <div className="outer-box">
            <button className="menu-btn">
              <span className="count">1</span>
              <span className="icon la la-heart-o"></span>
            </button>
            {/* wishlisted menu */}

            <button className="menu-btn">
              <span className="icon la la-bell"></span>
            </button>
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
    </header>
  );
};

export default DashboardHeader;
