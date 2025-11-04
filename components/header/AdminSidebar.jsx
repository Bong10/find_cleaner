'use client';

import Link from "next/link";
import Image from "next/image";
import adminMenuData from "../../data/adminMenuData";
import { isActiveLink } from "../../utils/linkActiveChecker";
import { useState } from "react";
import ConfirmModal from "../common/ConfirmModal";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { performLogout } from "@/store/slices/authSlice";
import { toast } from "react-toastify";

const AdminSidebar = ({ isOpen, onClose, isMobile }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const pathname = usePathname();
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
      toast.success("Logged out successfully");
      
      setTimeout(() => {
        window.location.replace("/admin/login");
      }, 200);
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
      setIsLoggingOut(false);
    }
  };

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <>
      <div className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* Logo at Top */}
        <div className="sidebar-logo">
          <Link href="/admin-dashboard/overview" onClick={handleLinkClick}>
            <Image
              alt="TidyLinker"
              src="/images/logo.png"
              width={48}
              height={36}
              priority
            />
            <div className="logo-text">
              <span className="brand-name">TidyLinker</span>
              <span className="subtitle">ADMIN PORTAL</span>
            </div>
          </Link>
        </div>

        {/* Close button for mobile */}
        {isMobile && (
          <button className="mobile-close-btn" onClick={onClose}>
            <span className="la la-times"></span>
          </button>
        )}

        {/* Navigation Menu */}
        <div className="sidebar-inner">
          <ul className="navigation">
            {adminMenuData.map((item) => {
              const isActive = isActiveLink(item.routePath, pathname);
              const isLogout = item.name === "Logout" || item.id === 12;

              return (
                <li
                  className={`${isActive ? "active" : ""} mb-1`}
                  key={item.id}
                >
                  <Link
                    href={isLogout ? "#" : item.routePath}
                    onClick={isLogout ? handleLogoutClick : handleLinkClick}
                  >
                    <i className={`la ${item.icon}`}></i> {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* User Info at Bottom */}
        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">
              <span className="la la-user-shield"></span>
            </div>
            <div className="admin-details">
              <h5>{user?.email?.split('@')[0] || 'Admin'}</h5>
              <p>Administrator</p>
            </div>
          </div>
        </div>
      </div>

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

      <style jsx global>{`
        .admin-sidebar {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          width: 260px;
          background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
          overflow-y: auto;
          overflow-x: hidden;
          transition: transform 0.3s ease;
          z-index: 999;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }

        .admin-sidebar::-webkit-scrollbar {
          width: 5px;
        }

        .admin-sidebar::-webkit-scrollbar-track {
          background: transparent;
        }

        .admin-sidebar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .admin-sidebar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Logo Section */
        .sidebar-logo {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(139, 92, 246, 0.2);
        }

        .sidebar-logo a {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .brand-name {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .subtitle {
          font-size: 9px;
          font-weight: 700;
          color: #8b5cf6;
          letter-spacing: 1px;
        }

        .sidebar-inner {
          flex: 1;
          padding: 20px 0;
          overflow-y: auto;
        }

        /* Beautiful Custom Scrollbar for Menu */
        .sidebar-inner::-webkit-scrollbar {
          width: 10px !important;
          background: transparent !important;
        }

        .sidebar-inner::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.4) !important;
          border-radius: 12px !important;
          margin: 8px 4px !important;
          box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3) !important;
        }

        .sidebar-inner::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #667eea 0%, #764ba2 100%) !important;
          border-radius: 12px !important;
          border: 2px solid rgba(30, 41, 59, 0.6) !important;
          box-shadow: 0 2px 6px rgba(102, 126, 234, 0.4) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .sidebar-inner::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #7c8fec 0%, #8b5cf6 100%) !important;
          border-color: rgba(30, 41, 59, 0.4) !important;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.6) !important;
        }

        .sidebar-inner::-webkit-scrollbar-thumb:active {
          background: linear-gradient(180deg, #8b5cf6 0%, #9333ea 100%) !important;
          box-shadow: 0 2px 8px rgba(147, 51, 234, 0.8) !important;
        }

        /* Footer with User Info */
        .sidebar-footer {
          padding: 16px 20px 20px;
          border-top: 1px solid rgba(139, 92, 246, 0.2);
          background: rgba(0, 0, 0, 0.2);
        }

        .admin-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-info .admin-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: grid;
          place-items: center;
          color: white;
          font-size: 24px;
          flex-shrink: 0;
        }

        .admin-details {
          flex: 1;
          min-width: 0;
        }

        .admin-details h5 {
          font-size: 15px;
          font-weight: 600;
          color: white;
          margin: 0 0 4px;
          text-transform: capitalize;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-details p {
          font-size: 12px;
          color: #94a3b8;
          margin: 0;
        }

        .mobile-close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(139, 92, 246, 0.2);
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          display: none;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          z-index: 10;
        }

        .mobile-close-btn:hover {
          background: rgba(139, 92, 246, 0.3);
        }

        .sidebar-inner {
          padding: 20px 0;
        }

        .admin-sidebar .navigation {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .admin-sidebar .navigation li {
          margin-bottom: 4px;
        }

        .admin-sidebar .navigation li a {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 24px;
          color: #cbd5e1;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s;
          border-left: 3px solid transparent;
        }

        .admin-sidebar .navigation li a:hover {
          color: #ffffff;
          background: rgba(139, 92, 246, 0.15);
          border-left-color: #8b5cf6;
        }

        .admin-sidebar .navigation li.active a {
          color: #ffffff;
          background: rgba(139, 92, 246, 0.15);
          border-left-color: #8b5cf6;
        }

        .admin-sidebar .navigation li a i {
          font-size: 18px;
          color: #94a3b8;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }

        .admin-sidebar .navigation li.active a i,
        .admin-sidebar .navigation li a:hover i {
          color: #8b5cf6;
        }

        @media (max-width: 991px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }

          .admin-sidebar.open {
            transform: translateX(0);
          }

          .mobile-close-btn {
            display: flex;
          }
        }

        @media (min-width: 992px) {
          .admin-sidebar.closed {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;
