'use client';

import RegBanner from "../block/RegBanner";
import LoginPopup from "../common/form/login/LoginPopup";
import FooterDefault from "../footer/common-footer";
import MobileMenu from "../header/MobileMenu";
import Hero13 from "../hero/hero-13";
import CategoryIcons from "../job-categories/home/CategoryRibbon"
import Header from "./Header";

const index = () => {
  return (
    <>
      <LoginPopup />
      {/* End Login Popup Modal */}

      <Header />
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}

     
      <CategoryIcons />
      {/* End CategoryIcons */}

    <div className="home_bggrey"> 
      <Hero13 />
      {/* End Hero Section */}
    
      <section className="layout-pt-60 layout-pb-60">
        <div className="auto-container">
          <div className="row" data-aos="fade-up">
            <RegBanner />
          </div>
        </div>
      </section>
      </div>



      <FooterDefault footerStyle="-type-13 alternat" />
      {/* <!-- End Main Footer --> */}

      <style jsx>{`
        .home_bggrey {
          background: #F3F4F6;
          padding-top: 60px;
        }
      `}</style>
    </>
  );
};

export default index;
