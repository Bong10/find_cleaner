// components/dashboard-pages/employers-dashboard/dashboard/index.jsx
"use client";

import React, { useEffect, useMemo, useRef } from "react";
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
import { fetchUnreadCount } from "@/store/slices/messagesSlice";
import {
  fetchNotifications,
  selectNotifications,
  selectNotificationsLoading,
} from "@/store/slices/notificationsSlice";

export default function EmployerDashboard() {
  const dispatch = useDispatch();
  const pollRef = useRef(null);

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
    // keep global unread fresh while on dashboard
    dispatch(fetchUnreadCount());
    if (!pollRef.current) {
      pollRef.current = setInterval(() => dispatch(fetchUnreadCount()), 10000);
    }
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [dispatch, myJobsStatus, applicantsStatus, shortlistStatus]);

  // recent 6 applicants
  const recentApplicants = useMemo(() => {
    const sorted = [...allApplicants].sort((a, b) =>
      String(b.date_applied || b.created_at || "").localeCompare(
        String(a.date_applied || a.created_at || "")
      )
    );
    return sorted.slice(0, 6);
  }, [allApplicants]);

  // pending applications per ISO week (for chart)
  const chartSeries = useMemo(() => {
    const weeks = new Map();
    const toWeekKey = (iso) => {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return null;
      const day = (d.getUTCDay() + 6) % 7; // Mon=0..Sun=6
      const thurs = new Date(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - day + 3)
      );
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

  // Show loading shimmer for top cards if any base slice is loading
  const anyLoading =
    myJobsStatus === "loading" ||
    applicantsStatus === "loading" ||
    shortlistStatus === "loading";

  // Notifications from store
  const notifItems = useSelector(selectNotifications);
  const notifLoading = useSelector(selectNotificationsLoading);

  // Fetch notifications on load
  useEffect(() => {
    dispatch(fetchNotifications({ limit: 10 }));
  }, [dispatch]);

  // Map notifications to the widget item shape
  const employerNotifications = useMemo(() => {
    const sorted = [...(notifItems || [])].sort((a, b) => {
      const da = new Date(a?.created_at || 0).getTime();
      const db = new Date(b?.created_at || 0).getTime();
      return db - da; // newest first
    });
    return sorted.slice(0, 5).map((n) => {
      // Build href based on type/target
      const typeL = (n?.type || "").toLowerCase();
      const t = n?.target || {};
      let href = undefined;
      if (typeL === "booking" || (t?.type || "").toLowerCase() === "booking") {
        href = `/employers-dashboard/bookings${t?.id ? `?booking=${t.id}` : ""}`;
      } else if (typeL === "message" || (t?.type || "").toLowerCase() === "chat") {
        href = `/employers-dashboard/messages${t?.id ? `?chat=${t.id}` : ""}`;
      } else if (typeL === "job" || (t?.type || "").toLowerCase() === "job") {
        href = t?.id ? `/job-single-v1/${t.id}` : undefined;
      }

      // Actor + action + subject lines
      const actor = n?.actorName || undefined;
      let action = n?.title || n?.message || "Notification";
      let subject = n?.targetTitle || undefined;

      // Time formatting: show time if today, else date
      let time = "";
      if (n?.created_at) {
        const d = new Date(n.created_at);
        if (!isNaN(d.getTime())) {
          const today = new Date();
          const sameDay = d.toDateString() === today.toDateString();
          time = sameDay
            ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : d.toLocaleDateString();
        }
      }

      // icon mapping uses line-awesome classes from slice
      const icon = n?.icon ? `la ${n.icon}` : "la la-bell";
      const iconColor = n?.iconColor || undefined;
      const iconBg = n?.iconBg || undefined;

      return { id: n.id, icon, iconColor, iconBg, actor, action, subject, time, href, is_read: !!n.is_read, type: n.type };
    });
  }, [notifItems]);

  return (
    <div className="page-wrapper dashboard">
      {/* <span className="header-span"></span> */}

      <LoginPopup />
      <DashboardHeader />
      <MobileMenu />
      <DashboardEmployerSidebar />

      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title={`Welcome, ${firstName}!`} text="Ready to jump back in" />
          <MenuToggler />

          {/* Top metric cards (store-driven: Posted Jobs, Applications, Messages, Shortlist) */}
          <div className="row">
            <TopCardBlock />
          </div>

          {/* Chart + Notifications */}
          <div className="row align-items-stretch">
            <div className="col-xl-7 col-lg-12 d-flex">
              <div className="graph-widget ls-widget d-flex flex-column w-100">
                <div className="widget-title"><h4>Overview</h4></div>
                <ProfileChart
                  loading={applicantsStatus === "loading"}
                  title="Pending applications (last weeks)"
                  labels={chartSeries.labels}
                  data={chartSeries.data}
                />
              </div>
            </div>

            <div className="col-xl-5 col-lg-12 d-flex">
              <div className="notification-widget ls-widget d-flex flex-column w-100">
                <div className="widget-title"><h4>Recent notifications</h4></div>
                <div className="widget-content" style={{ flex: 1 }}>
                  <Notification items={employerNotifications} loading={!!notifLoading} />
                </div>
                <div className="widget-footer d-flex justify-content-center" style={{ padding: '0 20px 15px' }}>
                  <Link href="/employers-dashboard/resume-alerts" className="theme-btn btn-style-three">
                    View all notifications
                  </Link>
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
