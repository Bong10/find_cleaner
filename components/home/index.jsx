'use client';

import RegBanner from "../block/RegBanner";
import LoginPopup from "../common/form/login/LoginPopup";
import FooterDefault from "../footer/common-footer";
import MobileMenu from "../header/MobileMenu";
import Hero13 from "../hero/hero-13";
import JobFeatured9 from "../job-featured/JobFeatured9";
import FAQSection from "./FAQSection";
import About9 from "../about/About9";
import Block6 from "../block/Block6";
import Header from "./Header";
import CicBanner from "../common/CicBanner";
import CommunityImpactSection from "../common/CommunityImpactSection";
import SupportedCleaningSection from "../common/SupportedCleaningSection";

const index = () => {
  return (
    <>
      <LoginPopup />
      {/* End Login Popup Modal */}

      <Header />
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}

      <div className="home_hero_bg"> 
        <Hero13 />
        {/* End Hero Section */}
      </div>

      <CicBanner />
      {/* End CIC Banner */}

      <About9 />
    {/* <!-- End About Section --> */}

      <CommunityImpactSection />
      {/* End Community Impact Section */}

      <section className="work-section">
        <div className="auto-container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="sec-title text-center">
                <h2>How Our Platform Works</h2>
                <div className="text">
                  From posting a task to finding the perfect cleaner, it's quick and easy
              </div>
            </div>
          </div>
        </div>
        {/* End .row */}

        <div className="row grid-base" data-aos="fade-up">
          <Block6 />
        </div>
      </div>
    </section>
      {/* <!-- End Work Section --> */}

      <section className="banner-section">
        <div className="auto-container">
          <div className="row" data-aos="fade-up">
            <RegBanner />
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="auto-container" style={{ maxWidth: "100%" }}>
          <div className="featured-column">
            <div className="sec-title text-center">
              <h2 className="color-blue-dark fw-700">Explore Our List of Professional Cleaners</h2>
              <div className="text">
                Discover skilled and trusted cleaning experts ready to deliver exceptional services
              </div>
            </div>
            {/* End .sec-title */}
          </div>
          {/* End .featured-column */}

          <div className="outer-box job-block-five-separated" data-aos="fade-up">
            <JobFeatured9 />
          </div>
          {/* End outer-box */}
        </div>
      </section>
      {/* <!-- End Job Section --> */}

      <SupportedCleaningSection />
      {/* End Supported Cleaning Section */}

      <FAQSection />
      {/* <!-- End FAQ Section --> */}

      <FooterDefault footerStyle="-type-13 alternat" />
      {/* <!-- End Main Footer --> */}

      <style jsx>{`
        .home_hero_bg {
          background: #F8FAFF;
          padding-top: 8px;
          padding-bottom: 8px;
        }
        .work-section {
          padding: 70px 0 50px;
          background: #fff;
        }
        .work-section .sec-title {
          margin-bottom: 50px;
        }
        .work-section .sec-title h2 {
          font-size: 36px;
          font-weight: 700;
          color: #202124;
          margin-bottom: 15px;
        }
        .work-section .sec-title .text {
          font-size: 16px;
          color: #696969;
          line-height: 1.6;
        }
        .banner-section {
          padding: 40px 0;
          background: #f8faff;
        }
        .featured-section {
          padding: 70px 0 50px;
          background: #fff;
        }
        .featured-section .sec-title {
          margin-bottom: 45px;
        }
        .featured-section .sec-title h2 {
          font-size: 36px;
          font-weight: 700;
          color: #202124;
          margin-bottom: 15px;
        }
        .featured-section .sec-title .text {
          font-size: 16px;
          color: #696969;
          line-height: 1.6;
        }
        @media (max-width: 991px) {
          .work-section {
            padding: 60px 0 40px;
          }
          .featured-section {
            padding: 60px 0 40px;
          }
          .work-section .sec-title h2,
          .featured-section .sec-title h2 {
            font-size: 32px;
          }
          .banner-section {
            padding: 35px 0;
          }
          .work-section .sec-title,
          .featured-section .sec-title {
            margin-bottom: 35px;
          }
        }

        @media (max-width: 767px) {
          .work-section {
            padding: 50px 0 30px;
          }
          .featured-section {
            padding: 50px 0 30px;
          }
          .work-section .sec-title h2,
          .featured-section .sec-title h2 {
            font-size: 28px;
            margin-bottom: 12px;
          }
          .banner-section {
            padding: 30px 0;
          }
          .work-section .sec-title,
          .featured-section .sec-title {
            margin-bottom: 30px;
          }
          .work-section .sec-title .text,
          .featured-section .sec-title .text {
            font-size: 15px;
          }
        }

        @media (max-width: 576px) {
          .work-section {
            padding: 40px 0 25px;
          }
          .featured-section {
            padding: 40px 0 25px;
          }
          .work-section .sec-title h2,
          .featured-section .sec-title h2 {
            font-size: 26px;
          }
          .banner-section {
            padding: 25px 0;
          }
        }

        @media (max-width: 480px) {
          .work-section {
            padding: 35px 0 20px;
          }
          .featured-section {
            padding: 35px 0 20px;
          }
          .work-section .sec-title h2,
          .featured-section .sec-title h2 {
            font-size: 24px;
          }
          .banner-section {
            padding: 20px 0;
          }
          .work-section .sec-title .text,
          .featured-section .sec-title .text {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
};

export default index;
