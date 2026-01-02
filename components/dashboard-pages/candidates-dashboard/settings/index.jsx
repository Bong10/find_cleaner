"use client";

import MobileMenu from "@/components/header/MobileMenu";
import LoginPopup from "@/components/common/form/login/LoginPopup";
import DashboardCandidatesSidebar from "@/components/header/DashboardCandidatesSidebar";
import BreadCrumb from "@/components/dashboard-pages/BreadCrumb";
import CopyrightFooter from "@/components/dashboard-pages/CopyrightFooter";
import DashboardCandidatesHeader from "@/components/header/DashboardCandidatesHeader";
import MenuToggler from "@/components/dashboard-pages/MenuToggler";

import NotificationSettings from "@/components/dashboard-pages/employers-dashboard/notification-settings";

const Index = () => {
  return (
    <div className="page-wrapper dashboard">
      <LoginPopup />

      <DashboardCandidatesHeader />

      <MobileMenu />

      <DashboardCandidatesSidebar />

      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="Settings" />

          <MenuToggler />

          <div className="row">
            <div className="col-lg-12">
              <div className="ls-widget">
                <div className="tabs-box">
                  <div className="widget-title">
                    <h4>Settings</h4>
                  </div>

                  <div className="widget-content">
                    <NotificationSettings />
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
};

export default Index;
