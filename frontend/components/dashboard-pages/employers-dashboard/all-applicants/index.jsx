// components/dashboard-pages/employers-dashboard/all-applicants/index.jsx
"use client";

import MobileMenu from "../../../header/MobileMenu";
import DashboardHeader from "../../../header/DashboardHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
import BreadCrumb from "../../BreadCrumb";
import CopyrightFooter from "../../CopyrightFooter";
import WidgetContentBox from "./components/WidgetContentBox";
import WidgetTopFilterBox from "./components/WidgetTopFilterBox";
import MenuToggler from "../../MenuToggler";

// NEW: to read ?cleaner= and navigate back
import { useSearchParams, useRouter } from "next/navigation";
// NEW: details panel rendered when ?cleaner= is present
import CleanerDetails from "./components/CleanerDetails";

const IndexPage = () => {
  const search = useSearchParams();
  const router = useRouter();
  const cleanerId = search.get("cleaner"); // if present -> show details

  const goBackToList = () => router.push("/employers-dashboard/all-applicants");

  return (
    <div className="page-wrapper dashboard">
      {/* <span className="header-span"></span> */}
      {/* <!-- Header Span for hight --> */}

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DashboardHeader />
      {/* End Header */}

      <MobileMenu />
      {/* End MobileMenu */}

      <DashboardEmployerSidebar />
      {/* <!-- End User Sidebar Menu --> */}

      {/* <!-- Dashboard --> */}
      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="All Applicants!" />
          {/* breadCrumb */}

          <MenuToggler />
          {/* Collapsible sidebar button */}

          <div className="row">
            <div className="col-lg-12">
              {/* <!-- Ls widget --> */}
              <div className="ls-widget">
                {/* ====== ONLY THIS SECTION CHANGED (tabs-box swap) ====== */}
                {!cleanerId ? (
                  <div className="tabs-box">
                    <div className="widget-title">
                      <h4>Applicant</h4>
                      <WidgetTopFilterBox />
                    </div>
                    {/* End top widget filter bar */}

                    <WidgetContentBox />
                    {/* End widget-content */}
                  </div>
                ) : (
                  <div className="tabs-box">
                    <div className="widget-content">
                      <CleanerDetails />
                    </div>
                  </div>
                )}
                {/* ====== END CHANGE ====== */}
              </div>
            </div>
          </div>
          {/* End .row */}
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

export default IndexPage;
