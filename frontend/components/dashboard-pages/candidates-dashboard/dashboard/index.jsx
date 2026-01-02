"use client";

import MobileMenu from "../../../header/MobileMenu";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardCandidatesSidebar from "../../../header/DashboardCandidatesSidebar";
import BreadCrumb from "../../BreadCrumb";
import TopCardBlock from "./components/TopCardBlock";
import ProfileChart from "./components/ProfileChart";
import Notification from "./components/Notification";
import CopyrightFooter from "../../CopyrightFooter";
import JobApplied from "./components/JobApplied";
import DashboardCandidatesHeader from "../../../header/DashboardCandidatesHeader";
import MenuToggler from "../../MenuToggler";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMetrics, selectDashboardMetrics } from "@/store/slices/metricsSlice";
import { fetchUnreadCount } from "@/store/slices/messagesSlice";
import {
  fetchNotifications,
  selectNotifications,
  selectNotificationsLoading,
} from "@/store/slices/notificationsSlice";

const Index = () => {
  const dispatch = useDispatch();
  const metrics = useSelector(selectDashboardMetrics);
  
  // Get user from auth state (same pattern as employer dashboard)
  const { user } = useSelector((s) => s.auth || {});
  
  // Extract first name with multiple fallbacks (same logic as employer)
  const firstName =
    (user?.name?.trim()?.split(" ")[0]) ||
    user?.first_name ||
    (user?.email ? user.email.split("@")[0] : "there");

  const pollRef = useRef(null);
  useEffect(() => {
    // Fetch real metrics when component mounts
    dispatch(fetchMetrics());
    // Also keep unread messages badge fresh on dashboard
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
  }, [dispatch]);

  // Notifications: fetch and map to widget items
  const notifItems = useSelector(selectNotifications);
  const notifLoading = useSelector(selectNotificationsLoading);
  useEffect(() => {
    dispatch(fetchNotifications({ limit: 10 }));
  }, [dispatch]);

  const candidateNotifications = useMemo(() => {
    const sorted = [...(notifItems || [])].sort((a, b) => {
      const da = new Date(a?.created_at || 0).getTime();
      const db = new Date(b?.created_at || 0).getTime();
      return db - da; // newest first
    });
    return sorted.slice(0, 5).map((n) => {
      const typeL = (n?.type || "").toLowerCase();
      const t = n?.target || {};
      let href = undefined;
      if (typeL === "booking" || (t?.type || "").toLowerCase() === "booking") {
        href = `/candidates-dashboard/bookings${t?.id ? `?booking=${t.id}` : ""}`;
      } else if (typeL === "message" || (t?.type || "").toLowerCase() === "chat") {
        href = `/candidates-dashboard/messages${t?.id ? `?chat=${t.id}` : ""}`;
      } else if (typeL === "job" || (t?.type || "").toLowerCase() === "job") {
        href = t?.id ? `/job-single-v1/${t.id}` : undefined;
      }

      const actor = n?.actorName || undefined;
      let action = n?.title || n?.message || "Notification";
      let subject = n?.targetTitle || undefined;

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

      const icon = n?.icon ? `la ${n.icon}` : "la la-bell";
      const iconColor = n?.iconColor || undefined;
      const iconBg = n?.iconBg || undefined;
      return { id: n.id, icon, iconColor, iconBg, actor, action, subject, time, href, is_read: !!n.is_read, type: n.type };
    });
  }, [notifItems]);

  return (
    <div className="page-wrapper dashboard">
      {/* <span className="header-span"></span> */}
      {/* <!-- Header Span for hight --> */}

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DashboardCandidatesHeader />
      {/* End Header */}

      <MobileMenu />
      {/* End MobileMenu */}

      <DashboardCandidatesSidebar />
      {/* <!-- End Candidates Sidebar Menu --> */}

      {/* <!-- Dashboard --> */}
      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title={`Welcome, ${firstName}!`} />
          {/* breadCrumb with dynamic name */}

          <MenuToggler />
          {/* Collapsible sidebar button */}

          <div className="row">
            <TopCardBlock />
          </div>
          {/* End .row top card block */}

          <div className="row">
            <div className="col-xl-7 col-lg-12 d-flex">
              {/* <!-- Graph widget --> */}
              <div className="graph-widget ls-widget d-flex flex-column w-100">
                <ProfileChart />
              </div>
              {/* End profile chart */}
            </div>
            {/* End .col */}

            <div className="col-xl-5 col-lg-12 d-flex">
              {/* <!-- Notification Widget --> */}
              <div className="notification-widget ls-widget d-flex flex-column w-100">
                <div className="widget-title"><h4>Recent notifications</h4></div>
                <div className="widget-content" style={{ flex: 1 }}>
                  <Notification items={candidateNotifications} loading={!!notifLoading} />
                </div>
                <div className="widget-footer d-flex justify-content-center" style={{ padding: '0 20px 15px' }}>
                  <Link href="/candidates-dashboard/job-alerts" className="theme-btn btn-style-three">
                    View all notifications
                  </Link>
                </div>
              </div>
            </div>
            {/* End .col */}

            <div className="col-lg-12">
              {/* <!-- applicants Widget --> */}
              <div className="applicants-widget ls-widget">
                <div className="widget-content">
                  <div className="row">
                    {/* <!-- Candidate block three --> */}

                    <JobApplied />
                  </div>
                </div>
              </div>
            </div>
            {/* End .col */}
          </div>
          {/* End .row profile and notificatins */}
        </div>
        {/* End dashboard-outer */}
      </section>
      {/* <!-- End Dashboard --> */}

      <CopyrightFooter />
      {/* <!-- End Copyright --> */}
    </div>
    // End page-wrapper
  );
};

export default Index;
