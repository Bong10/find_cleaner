'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { performLogout } from "@/store/slices/authSlice";
import ConfirmModal from "@/components/common/ConfirmModal";

const AdminHeader = ({ onToggleSidebar }) => {
  const [navbar, setNavbar] = useState(false);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    const changeBackground = () => setNavbar(window.scrollY >= 0);
    changeBackground();
    window.addEventListener("scroll", changeBackground);
    return () => window.removeEventListener("scroll", changeBackground);
  }, []);

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
      if (typeof window !== "undefined") window.location.replace("/admin/login");
    }
  };

  return (
    <>
      <header className={`main-header admin-header header-shaddow ${navbar ? "fixed-header" : ""}`}>
        <div className="container-fluid">
          <div className="main-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            
            {/* Toggle Button */}
            <button className="sidebar-toggle-btn" onClick={onToggleSidebar} aria-label="Toggle Sidebar">
              <span className="la la-bars"></span>
            </button>

            {/* Empty space where logo was */}
            <div style={{ flex: 1, margin: '0 20px' }}>
              {/* Logo moved to sidebar */}
            </div>

            {/* Right Side Actions */}
            <div className="outer-box">
              {/* Notifications */}
              <button className="menu-btn" aria-label="Notifications">
                <span className="icon la la-bell"></span>
              </button>

              {/* Settings */}
              <Link href="/admin-dashboard/settings">
                <button className="menu-btn" aria-label="Settings">
                  <span className="icon la la-cog"></span>
                </button>
              </Link>

              {/* Admin Account Dropdown */}
              <div className="dropdown dashboard-option">
                <a
                  className="dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="admin-avatar">
                    <span className="la la-user-shield"></span>
                  </div>
                  <span className="name">{user?.email?.split('@')[0] || 'Admin'}</span>
                </a>

                <ul className="dropdown-menu">
                  <li>
                    <Link href="/admin-dashboard/profile">
                      <i className="la la-user"></i> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin-dashboard/settings">
                      <i className="la la-cog"></i> Settings
                    </Link>
                  </li>
                  <li className="divide"></li>
                  <li>
                    <Link href="#" onClick={handleLogoutClick}>
                      <i className="la la-sign-out-alt"></i> Logout
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .admin-header {
            background: linear-gradient(90deg, #1e293b 0%, #0f172a 100%);
            border-bottom: 1px solid rgba(139, 92, 246, 0.2);
            position: sticky;
            top: 0;
            z-index: 100;
            height: 85px !important;
            min-height: 85px !important;
            max-height: 85px !important;
          }

          .admin-header .container-fluid {
            padding: 0 24px 0 12px;
            height: 100%;
          }

          .admin-header .main-box {
            height: 100%;
            display: flex !important;
            align-items: center;
          }

          .sidebar-toggle-btn {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: #ffffff;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            margin-right: 16px;
            margin-left: 0;
          }

          .sidebar-toggle-btn:hover {
            background: rgba(139, 92, 246, 0.25);
            color: #a78bfa;
          }

          .admin-header .menu-btn {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
            border: none;
            color: #ffffff;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            margin-left: 8px;
          }

          .admin-header .menu-btn:hover {
            background: rgba(139, 92, 246, 0.2);
            color: #a78bfa;
          }

          .admin-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: grid;
            place-items: center;
            color: white;
            font-size: 20px;
          }

          .admin-header .dropdown-toggle {
            color: #ffffff;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .admin-header .dropdown-toggle:hover {
            color: #a78bfa;
          }

          .admin-header .dropdown-toggle .name {
            color: #ffffff;
          }

          .admin-header .dropdown-menu {
            background: #1e293b;
            border: 1px solid rgba(139, 92, 246, 0.4);
            min-width: 220px;
            margin-top: 16px !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            padding: 8px 0;
          }

          .admin-header .dropdown-menu li a {
            color: #f1f5f9;
            padding: 14px 24px;
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .admin-header .dropdown-menu li a:hover {
            background: rgba(139, 92, 246, 0.25);
            color: #ffffff;
          }

          .admin-header .dropdown-menu li a i {
            color: #c4b5fd;
            font-size: 18px;
            width: 20px;
          }

          .admin-header .dropdown-menu li.divide {
            height: 1px;
            background: rgba(139, 92, 246, 0.2);
            margin: 8px 0;
          }

          @media (max-width: 768px) {
            .logo-box .admin-badge {
              display: none;
            }
          }
        `}</style>
      </header>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => !isLoggingOut && setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout from the admin portal?"
        confirmText={isLoggingOut ? "Logging out..." : "Yes, Logout"}
        cancelText="Cancel"
        confirmStyle="primary"
        icon="la-sign-out-alt"
      />
    </>
  );
};

export default AdminHeader;
