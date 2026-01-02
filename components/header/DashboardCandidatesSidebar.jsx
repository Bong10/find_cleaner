// components/header/DashboardCandidatesSidebar.jsx
'use client'

import Link from "next/link";
import candidatesuData from "../../data/candidatesMenuData";
import { isActiveLink } from "../../utils/linkActiveChecker";
import { useState } from "react";
import ConfirmModal from "../common/ConfirmModal";

import { useDispatch, useSelector } from "react-redux";
import { menuToggle } from "../../features/toggle/toggleSlice";
import { usePathname } from "next/navigation";
import { performLogout } from "@/store/slices/authSlice";
import { toast } from "react-toastify";

const DashboardCandidatesSidebar = () => {
  const { menu } = useSelector((state) => state.toggle);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuToggleHandler = () => {
    dispatch(menuToggle());
  };

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
      
      // Redirect to login directly
      setTimeout(() => {
        window.location.replace("/login");
      }, 200);
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <div className={`user-sidebar ${menu ? "sidebar_open" : ""}`}>
        {/* Start sidebar close icon */}
        <div className="pro-header text-end pb-0 mb-0 show-1023">
          <div className="fix-icon" onClick={menuToggleHandler}>
            <span className="flaticon-close"></span>
          </div>
        </div>
        {/* End sidebar close icon */}

        <div className="sidebar-inner">
          <ul className="navigation">
            {candidatesuData.map((item) => {
              const isActive = isActiveLink(item.routePath, pathname);
              const isLogout = item.name === "Logout";

              return (
                <li
                  className={`${isActive ? "active" : ""} mb-1`}
                  key={item.id}
                  onClick={!isLogout ? menuToggleHandler : undefined}
                >
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
          {/* End navigation */}
        </div>
      </div>

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

export default DashboardCandidatesSidebar;
