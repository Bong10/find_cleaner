// components/header/DashboardEmployerSidebar.jsx
'use client'

import Link from "next/link";
import employerMenuData from "../../data/employerMenuData";
import { isActiveLink } from "../../utils/linkActiveChecker";

import { useDispatch, useSelector } from "react-redux";
import { menuToggle } from "../../features/toggle/toggleSlice";
import { usePathname } from "next/navigation";
import { performLogout } from "@/store/slices/authSlice"; // ← use your existing thunk

const DashboardEmployerSidebar = () => {
  const { menu } = useSelector((state) => state.toggle);
  const dispatch = useDispatch();
  const pathname = usePathname(); // keep everything else the same

  const menuToggleHandler = () => {
    dispatch(menuToggle());
  };

  const handleLogoutClick = async (e) => {
    e.preventDefault();
    try {
      await dispatch(performLogout());
    } finally {
      // hard reload + replace history to land user out of authed context
      if (typeof window !== "undefined") window.location.replace("/");
    }
  };

  return (
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
  );
};

export default DashboardEmployerSidebar;
