'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import candidatesMenuData from "../../data/candidatesMenuData";
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

const DashboardCandidatesHeader = () => {
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
        return () => { if (timer) clearInterval(timer); };
    }, [dispatch]);

    // avatar from backend (fallback to candidate placeholder)
    let avatarSrc = "/images/resource/candidate-1.png";
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
        <header
            className={`main-header header-shaddow  ${
                navbar ? "fixed-header " : ""
            }`}
        >
            <div className="container-fluid">
                {/* <!-- Main box --> */}
                <div className="main-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Logo Box - Left Side */}
                    <div className="logo-box">
                        <div className="logo">
                            <Link href="/">
                                <Image
                                    alt="brand"
                                    src="/images/logo.png"
                                    width={54}
                                    height={40}
                                    priority
                                />
                            </Link>
                        </div>
                    </div>
                    {/* End .logo-box */}

                    {/* Nav Outer - Center */}
                    <div className="nav-outer" style={{ 
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        margin: '0'
                    }}>
                        <HeaderNavContent />
                        {/* <!-- Main Menu End--> */}
                    </div>
                    {/* End .nav-outer */}

                    {/* Outer Box - Right Side */}
                    <div className="outer-box">
                        <button className="menu-btn">
                            <span className="count">1</span>
                            <span className="icon la la-heart-o"></span>
                        </button>
                        {/* wishlisted menu */}

                        <Link href="/candidates-dashboard/job-alerts" className="menu-btn" aria-label="Notifications">
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
                                    style={{ objectFit: 'cover', borderRadius: '50%' }}
                                />
                                <span className="name">My Account</span>
                            </a>

                            <ul className="dropdown-menu">
                                {candidatesMenuData.map((item) => {
                                    const isActive = isActiveLink(item.routePath, pathname);
                                    const isLogout = item.name === "Logout" || item.id === 10;

                                    return (
                                        <li
                                            className={`${isActive ? "active" : ""} mb-1`}
                                            key={item.id}
                                        >
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
                                /* Bell badge centering */
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

export default DashboardCandidatesHeader;
