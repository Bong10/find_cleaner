import About9 from "../about/About9";
import AppSection3 from "../app-section/AppSection3";
import Block6 from "../block/Block6";
import RegBanner from "../block/RegBanner";
import LoginPopup from "../common/form/login/LoginPopup";
import Partner2 from "../common/partner/Partner2";
import FooterDefault from "../footer/common-footer";
import MobileMenu from "../header/MobileMenu";
import Hero13 from "../hero/hero-13";
import JobCategorie7 from "../job-categories/JobCategorie7";
import JobFeatured9 from "../job-featured/JobFeatured9";
import Pricing3 from "../pricing/Pricing3";
import TopCompany from "../top-company/TopCompany";
import Header from "./Header";
import StatsSection from "./StatsSection";
import HowItWorksSection from "./HowItWorksSection";
import TestimonialsSection from "./TestimonialsSection";
import CTASection from "./CTASection";
import PricingTransparency from "./PricingTransparency";
import GuaranteesSection from "./GuaranteesSection";
import FAQSection from "./FAQSection";
import PopularLocationsSection from "./PopularLocationsSection";

const index = () => {
  return (
    <>
      <LoginPopup />
      {/* End Login Popup Modal */}

      <Header />
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}

      <Hero13 />
      {/* End Hero Section */}

      <StatsSection />
      {/* End Stats Section - Trust Indicators */}

      <section className="layout-pt-120 layout-pb-60">
        <div className="auto-container">
          <div className="row justify-content-between align-items-end">
            <div className="col-lg-6">
              <div className="sect-title">
                <h2 className="fw-700">Explore Cleaning Services by Type</h2>
                <div className="text mt-9">
                Find Verified Professionals Across Categories.
                </div>
              </div>
            </div>
            {/* End sectitle */}
            <div className="col-auto">
              <a href="#" className="button-icon -arrow text-dark-blue">
                Browse All
                <span className="fa fa-angle-right ms-1"></span>
              </a>
            </div>
          </div>
          {/* End .row */}

          <div className="row grid-flex pt-50" data-aos="fade-up">
            <JobCategorie7 />
          </div>
          {/* End .row */}
        </div>
      </section>
      {/* <!-- End Job Categories --> */}

      <PricingTransparency />
      {/* <!-- End Pricing Transparency Section --> */}

      <HowItWorksSection />
      {/* <!-- End How It Works Section --> */}

      <section className="layout-pt-60 layout-pb-60">
        <div className="auto-container">
          <div className="row justify-content-center">
            <div className="col-lg-5">
              <div className="sec-title text-center">
                <h2>How Our Platform Works?</h2>
                <div className="text">
                From posting a task to finding the perfect cleaner, it’s quick and easy
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

      <CTASection />
      {/* <!-- End CTA Section --> */}

      <TestimonialsSection />
      {/* <!-- End Testimonials Section --> */}

      <GuaranteesSection />
      {/* <!-- End Guarantees Section --> */}

      <About9 />
      {/* <!-- End About Section --> */}

      <section className="layout-pt-60 layout-pb-60">
        <div className="auto-container" style={{ maxWidth: "100%" }}>
          <div className="featured-column">
            <div className="sec-title text-center">
              <h2 className="color-blue-dark fw-700">Explore Our List of Professional Cleaners</h2>
              <div className="text">
              Discover skilled and trusted cleaning experts ready to deliver exceptional services tailored to your needs.
              </div>
            </div>
            {/* End .sec-title */}
          </div>
          {/* End .featured-column */}

          <div
            className="outer-box job-block-five-separated"
            data-aos="fade-up"
          >
            <JobFeatured9 />
          </div>
          {/* End outer-box */}
        </div>
      </section>
      {/* <!-- End Job Section --> */}

      <PopularLocationsSection />
      {/* <!-- End Popular Locations Section --> */}

      <section className="layout-pt-60 layout-pb-60">
        <div className="auto-container">
          <div className="row" data-aos="fade-up">
            <RegBanner />
          </div>
        </div>
      </section>
      {/* <!-- End Registeration Banners --> */}

      <section className="ayout-pt-60 layout-pb-60">
        <div className="auto-container">
          <div className="row justify-content-between align-items-end">
            <div className="col-lg-6">
              <div className="sec-title mb-0">
                <h2 className="color-blue-dark fw-700">
                Trusted by Thousands of Households and Small Businesses
                </h2>
                <div className="text">
                Join a network of satisfied customers who rely on our platform to find background-verified cleaners for their needs.
                </div>
              </div>
            </div>
            {/* End .col */}

            <div className="col-auto">
              <a href="#" className="button -arrow text-dark-blue">
                Browse
                <span className="fa fa-angle-right ms-1"></span>
              </a>
            </div>
          </div>
          {/* End .row */}

          <div className="carousel-outer pt-50" data-aos="fade-up">
            <div className="companies-carousel">
              <TopCompany />
            </div>
          </div>
        </div>
      </section>
      {/* <!-- End Top Companies --> */}

      <section className="layout-pt-60 layout-pb-120">
        <div className="auto-container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="sec-title -type-2 text-center">
                <h2>Find the Right Plan for Your Cleaning Needs.</h2>
                <div className="text">
                Whether it's a quick clean or regular maintenance, we've got a plan to match.
                </div>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="row grid-base pricing3_hover" data-aos="fade-up">
            <Pricing3 />
          </div>
          {/* End .row */}
        </div>
      </section>
      {/* <!-- End Pricing Section --> */}

      <AppSection3 />
      {/* <!-- End App Section --> */}

      <FAQSection />
      {/* <!-- End FAQ Section --> */}

      <section className="clients-section-two alternate layout-pt-120 layout-pb-60">
        <div className="auto-container">
          <div className="sponsors-outer wow fadeInUp">
            <div className="sponsors-carousel">
              <Partner2 />
            </div>
          </div>
        </div>
      </section>
      {/* <!-- End Clients Section --> */}

      <FooterDefault footerStyle="-type-13 alternate3" />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default index;
