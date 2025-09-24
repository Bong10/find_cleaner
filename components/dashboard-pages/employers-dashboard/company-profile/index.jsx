"use client";

import MobileMenu from "../../../header/MobileMenu";
import DashboardHeader from "../../../header/DashboardHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
import BreadCrumb from "../../BreadCrumb";
import MyProfile from "./components/my-profile";
import SocialNetworkBox from "./components/SocialNetworkBox";
import ContactInfoBox from "./components/ContactInfoBox";
import CopyrightFooter from "../../CopyrightFooter";
import MenuToggler from "../../MenuToggler";

// ⬇️ Redux: prefetch employer profile (no Context)
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployerProfile,
  selectEmployerProfile,
} from "@/store/slices/employerProfileSlice"; // adjust alias if needed

const index = () => {
  const dispatch = useDispatch();
  const { status } = useSelector(selectEmployerProfile);

  // Prefetch profile once on mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchEmployerProfile());
    }
  }, [status, dispatch]);

  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>

      <LoginPopup />
      <DashboardHeader />
      <MobileMenu />
      <DashboardEmployerSidebar />

      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="Company Profile!" />
          <MenuToggler />

          {/* No Provider wrapper — Redux is the single source of truth */}
          <div className="row">
            <div className="col-lg-12">
              <div className="ls-widget">
                <div className="tabs-box">
                  <div className="widget-title">
                    <h4>My Profile</h4>
                  </div>
                  <MyProfile />
                </div>
              </div>

              <div className="ls-widget">
                <div className="tabs-box">
                  <div className="widget-title">
                    <h4>Contact Information</h4>
                  </div>
                  <div className="widget-content">
                    <ContactInfoBox />
                  </div>
                </div>
              </div>

              <div className="ls-widget">
                <div className="tabs-box">
                  <div className="widget-title">
                    <h4>Social Network</h4>
                  </div>
                  <div className="widget-content">
                    <SocialNetworkBox />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End .row */}
        </div>
        {/* End dashboard-outer */}
      </section>

      <CopyrightFooter />
    </div>
  );
};

export default index;
