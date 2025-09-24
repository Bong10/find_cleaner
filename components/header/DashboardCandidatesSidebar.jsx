// components/header/DashboardCandidatesSidebar.jsx
'use client'

import Link from "next/link";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import candidatesuData from "../../data/candidatesMenuData";
import { isActiveLink } from "../../utils/linkActiveChecker";

import { useDispatch, useSelector } from "react-redux";
import { menuToggle } from "../../features/toggle/toggleSlice";
import { usePathname } from "next/navigation";
import { performLogout } from "@/store/slices/authSlice"; // ← same thunk used on employer sidebar

const DashboardCandidatesSidebar = () => {
  const { menu } = useSelector((state) => state.toggle);
  const dispatch = useDispatch();
  const pathname = usePathname(); // call once (prevents extra renders)
  const percentage = 30;

  const menuToggleHandler = () => {
    dispatch(menuToggle());
  };

  const handleLogoutClick = async (e) => {
    e.preventDefault();
    try {
      await dispatch(performLogout());
    } finally {
      // ensure we leave the authed area
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
          {candidatesuData.map((item) => {
            const isActive = isActiveLink(item.routePath, pathname);
            const isLogout = item.name === "Logout" || item.id === 11; // same check as employer

            return (
              <li
                className={`${isActive ? "active" : ""} mb-1`}
                key={item.id}
                onClick={menuToggleHandler}
              >
                <Link
                  href={item.routePath}
                  onClick={isLogout ? handleLogoutClick : undefined}
                >
                  <i className={`la ${item.icon}`}></i> {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
        {/* End navigation */}

        <div className="skills-percentage">
          <h4>Skills Percentage</h4>
          <p>
            `Put value for <strong>Cover Image</strong> field to increase your
            skill up to <strong>85%</strong>`
          </p>
          <div style={{ width: 200, height: 200, margin: "auto" }}>
            <CircularProgressbar
              background
              backgroundPadding={6}
              styles={buildStyles({
                backgroundColor: "#7367F0",
                textColor: "#fff",
                pathColor: "#fff",
                trailColor: "transparent",
              })}
              value={percentage}
              text={`${percentage}%`}
            />
          </div>
          {/* <!-- Pie Graph --> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardCandidatesSidebar;
