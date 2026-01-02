// components/header/DashboardEmployerSidebar.jsx
'use client'

import Link from "next/link";
import employerMenuData from "../../data/employerMenuData";
import { isActiveLink } from "../../utils/linkActiveChecker";

import { useDispatch, useSelector } from "react-redux";
import { menuToggle } from "../../features/toggle/toggleSlice";
import { usePathname } from "next/navigation";
import { performLogout } from "@/store/slices/authSlice"; // ← use your existing thunk
import { useState } from "react";
import ConfirmModal from "@/components/common/ConfirmModal";

const DashboardEmployerSidebar = () => {
  const { menu } = useSelector((state) => state.toggle);
  const dispatch = useDispatch();
  const pathname = usePathname(); // keep everything else the same
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
    } finally {
      if (typeof window !== "undefined") window.location.replace("/login");
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
          {employerMenuData.map((item) => {
            const isActive = isActiveLink(item.routePath, pathname);
            const isLogout = item.name === "Logout" || item.id === 11;

            return (
              <li
                className={`${isActive ? "active" : ""} mb-1`}
                key={item.id}
                onClick={menuToggleHandler}
              >
                {/* For ALL items we keep the same design and markup.
                    For Logout only, we prevent default and run the thunk. */}
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

export default DashboardEmployerSidebar;
