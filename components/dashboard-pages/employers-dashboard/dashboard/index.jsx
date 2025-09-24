// components/dashboard-pages/employers-dashboard/dashboard/index.jsx
"use client";

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import MobileMenu from "../../../header/MobileMenu";
import DashboardHeader from "../../../header/DashboardHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
import BreadCrumb from "../../BreadCrumb";
import TopCardBlock from "./components/TopCardBlock";
import ProfileChart from "./components/ProfileChart";
import Notification from "./components/Notification";
import Applicants from "./components/Applicants";
import CopyrightFooter from "../../CopyrightFooter";
import MenuToggler from "../../MenuToggler";

import { fetchMyJobs, fetchMyJobMetrics } from "@/store/slices/myJobsSlice";
import { loadAllApplicants } from "@/store/slices/allApplicantsSlice";
import { selectShortlist, loadShortlist } from "@/store/slices/shortlistSlice";

export default function EmployerDashboard() {
  const dispatch = useDispatch();

  // greeting
  const { user } = useSelector((s) => s.auth || {});
  const firstName =
    (user?.name?.trim()?.split(" ")[0]) ||
    user?.first_name ||
    (user?.email ? user.email.split("@")[0] : "Employer");

  // my jobs
  const myJobsState = useSelector((s) => s.myJobs) || {};
  const myJobs = myJobsState.items || [];
  const myJobsStatus = myJobsState.status || "idle";

  // all applicants
  const allAppsState = useSelector((s) => s.allApplicants) || {};
  const allApplicants = allAppsState.items || [];
  const applicantsStatus = allAppsState.status || "idle";

  // shortlist
  const { items: shortlistItems = [], status: shortlistStatus = "idle" } =
    useSelector(selectShortlist);

  // boot data
  useEffect(() => {
    if (myJobsStatus === "idle") dispatch(fetchMyJobs({ months: 6 }));
    dispatch(fetchMyJobMetrics());
    if (applicantsStatus === "idle") dispatch(loadAllApplicants());
    if (shortlistStatus === "idle") dispatch(loadShortlist());
  }, [dispatch, myJobsStatus, applicantsStatus, shortlistStatus]);

  // dynamic counts
  const postedJobs = myJobs.length;
  const applications = allApplicants.length;
  const shortlist = shortlistItems.length;

  // static (for now)
  const messagesCount = 2;
  const notificationsCount = 3;
  const profileViews = 128;

  // recent 6 applicants
  const recentApplicants = useMemo(() => {
    const sorted = [...allApplicants].sort((a, b) =>
      String(b.date_applied || b.created_at || "").localeCompare(
        String(a.date_applied || a.created_at || "")
      )
    );
    return sorted.slice(0, 6);
  }, [allApplicants]);

  // simple weekly series for pending (visual only)
  const chartSeries = useMemo(() => {
    const weeks = new Map();
    const toWeekKey = (iso) => {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return null;
      const day = (d.getUTCDay() + 6) % 7;
      const thurs = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - day + 3));
      const firstThu = new Date(Date.UTC(thurs.getUTCFullYear(), 0, 4));
      const wk = 1 + Math.round(((thurs - firstThu) / 86400000 - 3) / 7);
      return `${thurs.getUTCFullYear()}-W${String(wk).padStart(2, "0")}`;
    };
    (allApplicants || []).forEach((a) => {
      if (a.status !== "p") return;
      const k = toWeekKey(a.date_applied || a.created_at);
      if (!k) return;
      weeks.set(k, (weeks.get(k) || 0) + 1);
    });
    const labels = Array.from(weeks.keys()).sort().slice(-8);
    return { labels, data: labels.map((k) => weeks.get(k)) };
  }, [allApplicants]);

  const staticNotifications = [
    { id: "n1", text: "Your company profile is 80% complete.", date: "Today" },
    { id: "n2", text: "Tip: Add more job details to attract candidates.", date: "Yesterday" },
    { id: "n3", text: "New features will be available soon.", date: "This week" },
  ];

  const anyLoading =
    myJobsStatus === "loading" ||
    applicantsStatus === "loading" ||
    shortlistStatus === "loading";

  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>

      <LoginPopup />
      <DashboardHeader />
      <MobileMenu />
      <DashboardEmployerSidebar />

      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title={`Welcome, ${firstName}!`} text="Ready to jump back in" />
          <MenuToggler />

          {/* Top metric cards (dynamic) */}
          <div className="row">
            <TopCardBlock
              loading={anyLoading}
              cards={[
                { label: "Posted Jobs", value: postedJobs, icon: "la-briefcase" },
                { label: "Applications", value: applications, icon: "la-file-invoice" },
                { label: "Shortlist", value: shortlist, icon: "la-bookmark-o" },
                { label: "Messages", value: messagesCount, icon: "la-comment-o" },
                { label: "Notifications", value: notificationsCount, icon: "la-bell" },
                { label: "Profile views", value: profileViews, icon: "la-eye" },
              ]}
            />
          </div>

          {/* Chart + Notifications */}
          <div className="row">
            <div className="col-xl-7 col-lg-12">
              <div className="graph-widget ls-widget">
                <div className="widget-title"><h4>Overview</h4></div>
                <ProfileChart
                  loading={applicantsStatus === "loading"}
                  title="Pending applications (last weeks)"
                  labels={chartSeries.labels}
                  data={chartSeries.data}
                />
              </div>
            </div>

            <div className="col-xl-5 col-lg-12">
              <div className="notification-widget ls-widget">
                <div className="widget-title"><h4>Notifications</h4></div>
                <div className="widget-content">
                  <Notification items={staticNotifications} />
                </div>
              </div>
            </div>

            {/* Recent applicants (dynamic) */}
            <div className="col-lg-12">
              <div className="applicants-widget ls-widget">
                <div className="widget-title d-flex justify-content-between align-items-center">
                  <h4>Recent Applicants</h4>
                  <Link href="/employers-dashboard/all-applicants" className="theme-btn btn-style-three">
                    View all
                  </Link>
                </div>
                <div className="widget-content">
                  <div className="row">
                    <Applicants items={recentApplicants} loading={applicantsStatus === "loading"} />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <CopyrightFooter />
    </div>
  );
}
