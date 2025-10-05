'use client'


import MobileMenu from "../../../header/MobileMenu";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardCandidatesSidebar from "../../../header/DashboardCandidatesSidebar";
import BreadCrumb from "../../BreadCrumb";
import CopyrightFooter from "../../CopyrightFooter";
import ContactList from "./components/ContactList";
import ContentField from "./components/ContentField";
import SearchBox from "./components/SearchBox";
import DashboardCandidatesHeader from "../../../header/DashboardCandidatesHeader";
import MenuToggler from "../../MenuToggler";

const index = () => {
  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>
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
          <BreadCrumb title="Messages" />
          {/* breadCrumb */}

          <MenuToggler />
          {/* Collapsible sidebar button */}

          <div className="row">
            <div className="col-lg-12">
              <div className="ls-widget">
                <div className="tabs-box">
                  <div className="widget-title">
                    <h4>My Messages</h4>
                  </div>
                  {/* End widget-title */}

                  <div className="widget-content">
                    <div className="row">
                      <div className="col-lg-4">
                        <div className="message-sidebar">
                          <SearchBox />
                          <ContactList />
                        </div>
                      </div>
                      {/* End .col */}

                      <div className="col-lg-8">
                        <ContentField />
                      </div>
                      {/* End .col */}
                    </div>
                    {/* End .row */}
                  </div>
                  {/* End widget-content */}
                </div>
                {/* End .tabs-box */}
              </div>
              {/* End .ls-widget */}
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

export default index;
