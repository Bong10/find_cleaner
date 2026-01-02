"use client";
import Image from "next/image";
import MobileMenu from "../header/MobileMenu";
import LoginPopup from "../common/form/login/LoginPopup";
import DefaulHeader2 from "../header/DefaulHeader2";
import FooterDefault from "../footer/common-footer";

const CommunityImpact = () => {
  const programmes = [
    {
      icon: "flaticon-resume",
      title: "Cleaner Training & Certification",
      description: "We provide training and support to cleaners who face barriers to employment – including migrants, single parents and low-income workers. Training covers cleaning skills, health & safety, communication and basic digital skills.",
      color: "#1967d2"
    },
    {
      icon: "flaticon-home-1",
      title: "Support for Elderly & Disabled",
      description: "We work to make cleaning more accessible to vulnerable groups by offering subsidised sessions and sponsored cleans, helping them live safely and independently at home.",
      color: "#34a853"
    },
    {
      icon: "flaticon-briefcase",
      title: "Fair Pay & Worker Protection",
      description: "We promote fair hourly rates, transparent pricing and decent working conditions. Cleaners have access to tools that help them track work, manage bookings and grow their income.",
      color: "#fbbc04"
    },
    {
      icon: "flaticon-pie-chart",
      title: "Reinvestment of Profits",
      description: "As a CIC, we reinvest at least 65% of our profits into training, support schemes and community programmes instead of paying out everything to shareholders.",
      color: "#ea4335"
    }
  ];

  const stats = [
    { number: "24", label: "Cleaners Trained", description: "Supported with certification" },
    { number: "18", label: "Subsidised Cleans", description: "For elderly & disabled residents" },
    { number: "65%", label: "Profits Reinvested", description: "Into community programmes" },
    { number: "5", label: "Community Partners", description: "Local organisations we work with" }
  ];

  return (
    <>
      <span className="header-span"></span>
      <LoginPopup />
      <DefaulHeader2 />
      <MobileMenu />

      {/* Page Title */}
      <section className="page-title">
        <div className="auto-container">
          <div className="title-outer">
            <h1>Community Impact</h1>
            <ul className="page-breadcrumb">
              <li><a href="/">Home</a></li>
              <li>Community Impact</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Hero Section with Mission */}
      <section className="mission-section">
        <div className="auto-container">
          <div className="row align-items-center">
            <div className="content-column col-lg-7 col-md-12">
              <div className="inner-column">
                <div className="badge-label">Community Interest Company</div>
                <h2>How Find Cleaner CIC Gives Back</h2>
                <p className="lead">
                  Find Cleaner is a <strong>Community Interest Company (CIC)</strong>. 
                  That means we exist to benefit the community – not just to make profit.
                </p>
                <div className="mission-points">
                  <div className="point-item">
                    <span className="icon flaticon-checked"></span>
                    <span>Fair, safe and stable work opportunities for cleaners</span>
                  </div>
                  <div className="point-item">
                    <span className="icon flaticon-checked"></span>
                    <span>Affordable, trustworthy cleaning for people who need it most</span>
                  </div>
                  <div className="point-item">
                    <span className="icon flaticon-checked"></span>
                    <span>Reinvesting our profits into training, support and social programmes</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="image-column col-lg-5 col-md-12">
              <div className="image-box">
                <Image 
                  src="/images/resource/community-hero.jpg" 
                  alt="Community Impact" 
                  width={500}
                  height={400}
                  className="rounded-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programmes Section */}
      <section className="programmes-section">
        <div className="auto-container">
          <div className="sec-title text-center">
            <h2>What We Do in the Community</h2>
            <div className="text">Our commitment to social impact goes beyond connecting cleaners with clients</div>
          </div>

          <div className="row">
            {programmes.map((programme, index) => (
              <div key={index} className="programme-block col-lg-6 col-md-12 col-sm-12">
                <div className="inner-box">
                  <div className="icon-box" style={{ background: `${programme.color}15` }}>
                    <span className={`icon ${programme.icon}`} style={{ color: programme.color }}></span>
                  </div>
                  <div className="content">
                    <h4>{programme.title}</h4>
                    <p>{programme.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="impact-stats">
        <div className="auto-container">
          <div className="sec-title text-center">
            <h2>Our Impact in Numbers</h2>
            <div className="text">Real results from our community programmes</div>
          </div>

          <div className="row">
            {stats.map((stat, index) => (
              <div key={index} className="stat-block col-lg-3 col-md-6 col-sm-12">
                <div className="stat-box">
                  <div className="number">{stat.number}</div>
                  <h4>{stat.label}</h4>
                  <p>{stat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="auto-container">
          <div className="cta-inner">
            <h3>Get Involved</h3>
            <p>Help us make a difference in our community</p>
            <div className="btn-box">
              <a href="/support-programmes" className="theme-btn btn-style-one">
                <span className="btn-title">Learn About Support Programmes</span>
              </a>
              <a href="/contact" className="theme-btn btn-style-two">
                <span className="btn-title">Partner With Us</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <FooterDefault footerStyle="alternate5" />

      <style jsx>{`
        .mission-section {
          padding: 80px 0;
          background: #fff;
        }
        .badge-label {
          display: inline-block;
          background: #e8f0fe;
          color: #1967d2;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 20px;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .mission-section h2 {
          font-size: 40px;
          font-weight: 700;
          color: #202124;
          margin-bottom: 20px;
          line-height: 1.2;
        }
        .lead {
          font-size: 18px;
          color: #696969;
          line-height: 1.7;
          margin-bottom: 30px;
        }
        .mission-points {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .point-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 15px;
          color: #202124;
        }
        .point-item .icon {
          color: #34a853;
          font-size: 20px;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .image-box {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .rounded-image {
          width: 100%;
          height: auto;
          display: block;
        }
        .programmes-section {
          padding: 100px 0;
          background: #f8f9fa;
        }
        .sec-title {
          margin-bottom: 50px;
        }
        .sec-title h2 {
          font-size: 36px;
          font-weight: 700;
          color: #202124;
          margin-bottom: 15px;
        }
        .sec-title .text {
          font-size: 16px;
          color: #696969;
        }
        .programme-block {
          margin-bottom: 30px;
        }
        .programme-block .inner-box {
          background: #fff;
          border-radius: 12px;
          padding: 35px;
          display: flex;
          gap: 25px;
          height: 100%;
          transition: all 0.3s ease;
          border: 1px solid #ecedf2;
        }
        .programme-block .inner-box:hover {
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          transform: translateY(-5px);
        }
        .icon-box {
          width: 70px;
          height: 70px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .icon-box .icon {
          font-size: 32px;
        }
        .content h4 {
          font-size: 20px;
          font-weight: 600;
          color: #202124;
          margin-bottom: 12px;
        }
        .content p {
          font-size: 15px;
          color: #696969;
          line-height: 1.7;
          margin: 0;
        }
        .impact-stats {
          padding: 100px 0;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
        .stat-block {
          margin-bottom: 30px;
        }
        .stat-box {
          background: #fff;
          border-radius: 12px;
          padding: 40px 30px;
          text-align: center;
          box-shadow: 0 5px 20px rgba(0,0,0,0.06);
          transition: all 0.3s ease;
          height: 100%;
        }
        .stat-box:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(25,103,210,0.12);
        }
        .stat-box .number {
          font-size: 48px;
          font-weight: 700;
          color: #1967d2;
          margin-bottom: 12px;
        }
        .stat-box h4 {
          font-size: 18px;
          font-weight: 600;
          color: #202124;
          margin-bottom: 8px;
        }
        .stat-box p {
          font-size: 14px;
          color: #696969;
          margin: 0;
        }
        .cta-section {
          padding: 80px 0;
          background: #fff;
        }
        .cta-inner {
          background: linear-gradient(135deg, #1967d2 0%, #155db1 100%);
          border-radius: 16px;
          padding: 60px;
          text-align: center;
          box-shadow: 0 15px 50px rgba(25,103,210,0.2);
        }
        .cta-inner h3 {
          font-size: 32px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 15px;
        }
        .cta-inner p {
          font-size: 18px;
          color: rgba(255,255,255,0.95);
          margin-bottom: 30px;
        }
        .btn-box {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .theme-btn {
          padding: 14px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 15px;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }
        .btn-style-one {
          background: #fff;
          color: #1967d2;
        }
        .btn-style-one:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        .btn-style-two {
          background: transparent;
          color: #fff;
          border: 2px solid #fff;
        }
        .btn-style-two:hover {
          background: #fff;
          color: #1967d2;
        }
        @media (max-width: 991px) {
          .mission-section h2 {
            font-size: 32px;
          }
          .image-column {
            margin-top: 40px;
          }
          .programme-block .inner-box {
            flex-direction: column;
          }
        }
        @media (max-width: 767px) {
          .mission-section {
            padding: 50px 0;
          }
          .programmes-section, .impact-stats {
            padding: 60px 0;
          }
          .cta-inner {
            padding: 40px 25px;
          }
          .cta-inner h3 {
            font-size: 24px;
          }
          .btn-box {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
};

export default CommunityImpact;
