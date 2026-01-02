"use client";

import Image from "next/image";

const IntroDescriptions = () => {
  return (
    <>
      {/* Our Story Section with Image */}
      <div className="story-section" style={{ marginTop: '60px' }}>
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-12" data-aos="fade-right">
            <div className="content-box">
              <h2>Our Story</h2>
              <p className="lead-text" style={{ fontSize: '18px', color: '#696969', lineHeight: '1.8', marginBottom: '20px' }}>
                Find Cleaner was created to solve two big problems: People struggled to find reliable cleaners they could trust, and cleaners spent too much time chasing clients instead of doing the job they're good at.
              </p>
              <p style={{ fontSize: '16px', color: '#696969', lineHeight: '1.8' }}>
                We built an online marketplace that connects homeowners and businesses with trusted, professional cleaners, making it easier to find reliable cleaning help and giving cleaners better access to steady, fairly paid work.
              </p>
            </div>
          </div>
          <div className="col-lg-6 col-md-12" data-aos="fade-left">
            <div className="image-box" style={{ 
              position: 'relative', 
              borderRadius: '12px', 
              overflow: 'hidden', 
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              height: '400px'
            }}>
              <Image
                src="/images/resource/about-story.png"
                alt="Our Story - Find Cleaner"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Mission Section with Image (Reversed Layout) */}
      <div className="mission-section" style={{ marginTop: '80px' }}>
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-12 order-lg-2" data-aos="fade-left">
            <div className="content-box">
              <h2>Our Mission</h2>
              <p className="lead-text" style={{ fontSize: '18px', color: '#696969', lineHeight: '1.8', marginBottom: '20px' }}>
                To make cleaning services simple, transparent, and accessible for everyone — while helping cleaners build sustainable, flexible careers.
              </p>
              <p style={{ fontSize: '16px', color: '#696969', lineHeight: '1.8' }}>
                We're dedicated to creating a trusted marketplace where quality meets convenience, ensuring both clients and cleaning professionals have the best possible experience.
              </p>
              <div className="highlight-box" style={{ 
                background: 'linear-gradient(135deg, #2aa389 0%, #1e8c73 100%)', 
                padding: '30px', 
                borderRadius: '12px', 
                marginTop: '30px',
                boxShadow: '0 4px 15px rgba(42, 163, 137, 0.2)'
              }}>
                <p style={{ fontSize: '18px', fontWeight: '600', color: '#ffffffff', marginBottom: '0' }}>
                  Great cleaners. Happy customers. One simple platform.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 order-lg-1" data-aos="fade-right">
            <div className="image-box" style={{ 
              position: 'relative', 
              borderRadius: '12px', 
              overflow: 'hidden', 
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              height: '400px'
            }}>
              <Image
                src="/images/resource/about-mission.png"
                alt="Our Mission - Find Cleaner"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* What We Offer Section */}
      <div className="offer-section" style={{ marginTop: '100px', background: '#f8f9fc', padding: '80px 0', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: '100vw' }}>
        <div className="container">
          <div className="sec-title text-center" style={{ marginBottom: '50px' }} data-aos="fade-up">
            <h2>What We Offer</h2>
            <div className="text">
              From regular house cleaning to deep cleans and end-of-tenancy jobs, we make the whole process easier.
            </div>
          </div>

          <div className="row" style={{ marginTop: '50px' }}>
            <div className="col-lg-4 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="0">
              <div className="offer-card" style={{
                background: 'white',
                padding: '40px 30px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                marginBottom: '30px',
                height: '100%',
                transition: 'all 0.3s ease'
              }}>
                <div className="icon-box" style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 25px',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                }}>
                  <i className="la la-users" style={{ fontSize: '40px', color: 'white' }}></i>
                </div>
                <h4 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '15px', color: '#202124' }}>Browse Profiles</h4>
                <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#696969', margin: 0 }}>
                  Browse cleaner profiles and services, see reviews and ratings to make informed decisions.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="100">
              <div className="offer-card" style={{
                background: 'white',
                padding: '40px 30px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                marginBottom: '30px',
                height: '100%',
                transition: 'all 0.3s ease'
              }}>
                <div className="icon-box" style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 25px',
                  boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)'
                }}>
                  <i className="la la-calendar-check" style={{ fontSize: '40px', color: 'white' }}></i>
                </div>
                <h4 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '15px', color: '#202124' }}>Manage Bookings</h4>
                <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#696969', margin: 0 }}>
                  Request and manage all your bookings online with our easy-to-use platform.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="200">
              <div className="offer-card" style={{
                background: 'white',
                padding: '40px 30px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                marginBottom: '30px',
                height: '100%',
                transition: 'all 0.3s ease'
              }}>
                <div className="icon-box" style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 25px',
                  boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)'
                }}>
                  <i className="la la-lock" style={{ fontSize: '40px', color: 'white' }}></i>
                </div>
                <h4 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '15px', color: '#202124' }}>Secure Communication</h4>
                <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#696969', margin: 0 }}>
                  Communicate securely with cleaners or clients and access support when you need it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How We Help - Two Column Section */}
      <div className="help-section" style={{ marginTop: '100px', marginBottom: '60px' }}>
        <div className="row">
          {/* For Cleaners */}
          <div className="col-lg-6 col-md-12 help-card-column" data-aos="fade-right">
            <div className="help-card" style={{
              background: 'linear-gradient(135deg, #2aa389 0%, #1e8c73 100%)',
              padding: '50px 40px',
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(42, 163, 137, 0.2)',
              marginBottom: '30px',
              height: '100%'
            }}>
              <div className="icon-badge" style={{
                width: '70px',
                height: '70px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '30px'
              }}>
                <i className="la la-briefcase" style={{ fontSize: '36px', color: 'white' }}></i>
              </div>
              <h3 style={{ fontSize: '36px', fontWeight: '700', color: 'white', marginBottom: '25px' }}>
                How We Help Cleaners
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ fontSize: '16px', color: 'rgba(255,255,255,0.95)', marginBottom: '18px', paddingLeft: '30px', position: 'relative' }}>
                  <i className="la la-check-circle" style={{ position: 'absolute', left: 0, fontSize: '22px', color: 'white' }}></i>
                  Reach more clients in your local area
                </li>
                <li style={{ fontSize: '16px', color: 'rgba(255,255,255,0.95)', marginBottom: '18px', paddingLeft: '30px', position: 'relative' }}>
                  <i className="la la-check-circle" style={{ position: 'absolute', left: 0, fontSize: '22px', color: 'white' }}></i>
                  Choose the jobs and schedule that suit you
                </li>
                <li style={{ fontSize: '16px', color: 'rgba(255,255,255,0.95)', marginBottom: '18px', paddingLeft: '30px', position: 'relative' }}>
                  <i className="la la-check-circle" style={{ position: 'absolute', left: 0, fontSize: '22px', color: 'white' }}></i>
                  Build a professional profile and reputation
                </li>
                <li style={{ fontSize: '16px', color: 'rgba(255,255,255,0.95)', marginBottom: '0', paddingLeft: '30px', position: 'relative' }}>
                  <i className="la la-check-circle" style={{ position: 'absolute', left: 0, fontSize: '22px', color: 'white' }}></i>
                  Manage bookings in one place
                </li>
              </ul>
            </div>
          </div>

          {/* For Homeowners */}
          <div className="col-lg-6 col-md-12 help-card-column" data-aos="fade-left">
            <div className="help-card" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '50px 40px',
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(102, 126, 234, 0.2)',
              marginBottom: '30px',
              height: '100%'
            }}>
              <div className="icon-badge" style={{
                width: '70px',
                height: '70px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '30px'
              }}>
                <i className="la la-home" style={{ fontSize: '36px', color: 'white' }}></i>
              </div>
              <h3 style={{ fontSize: '36px', fontWeight: '700', color: 'white', marginBottom: '25px' }}>
                How We Help Homeowners & Businesses
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ fontSize: '16px', color: 'rgba(255,255,255,0.95)', marginBottom: '18px', paddingLeft: '30px', position: 'relative' }}>
                  <i className="la la-check-circle" style={{ position: 'absolute', left: 0, fontSize: '22px', color: 'white' }}></i>
                  Find vetted, reviewed cleaners quickly
                </li>
                <li style={{ fontSize: '16px', color: 'rgba(255,255,255,0.95)', marginBottom: '18px', paddingLeft: '30px', position: 'relative' }}>
                  <i className="la la-check-circle" style={{ position: 'absolute', left: 0, fontSize: '22px', color: 'white' }}></i>
                  Compare services and prices easily
                </li>
                <li style={{ fontSize: '16px', color: 'rgba(255,255,255,0.95)', marginBottom: '18px', paddingLeft: '30px', position: 'relative' }}>
                  <i className="la la-check-circle" style={{ position: 'absolute', left: 0, fontSize: '22px', color: 'white' }}></i>
                  Book with confidence and clarity
                </li>
                <li style={{ fontSize: '16px', color: 'rgba(255,255,255,0.95)', marginBottom: '0', paddingLeft: '30px', position: 'relative' }}>
                  <i className="la la-check-circle" style={{ position: 'absolute', left: 0, fontSize: '22px', color: 'white' }}></i>
                  Enjoy a cleaner home or workspace without the hassle
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Desktop heading consistency */
        .story-section h2,
        .mission-section h2,
        .offer-section h2 {
          font-size: 36px;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 20px;
        }

        .help-section h3 {
          font-size: 36px;
          font-weight: 700;
          line-height: 1.3;
        }

        .offer-card:hover {
          transform: translateY(-8px);
          border-color: #2aa389 !important;
        }
        
        .help-card {
          position: relative;
          overflow: hidden;
        }
        
        .help-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        
        .help-card:hover::before {
          opacity: 1;
        }

        .section-title {
          font-size: 36px;
          font-weight: 700;
          color: #202124;
          margin-bottom: 25px;
        }

        /* Mobile styles - consistent spacing and heading sizes */
        @media (max-width: 767px) {
          /* Reduce Our Story top spacing */
          .story-section {
            margin-top: 30px !important;
          }

          /* Add spacing between text and image in Our Story */
          .story-section .content-box {
            margin-bottom: 30px;
          }

          /* Our Mission section spacing */
          .mission-section {
            margin-top: 50px !important;
          }

          /* Ensure Our Mission content comes before image on mobile */
          .mission-section .order-lg-1 {
            order: 2 !important;
          }
          .mission-section .order-lg-2 {
            order: 1 !important;
          }

          /* Add spacing between Our Mission text and image */
          .mission-section .content-box {
            margin-bottom: 30px;
          }

          /* What We Offer section spacing */
          .offer-section {
            margin-top: 50px !important;
            padding: 50px 0 !important;
          }

          /* How We Help section spacing - add gap between cards */
          .help-section {
            margin-top: 50px !important;
            margin-bottom: 30px !important;
          }

          /* Add spacing between the two help cards on mobile */
          .help-card-column {
            margin-bottom: 30px !important;
          }

          /* Remove extra margin from last card column */
          .help-card-column:last-child {
            margin-bottom: 0 !important;
          }

          /* Consistent heading sizes for all sections on mobile */
          .story-section h2,
          .mission-section h2,
          .offer-section h2,
          .help-section h3 {
            font-size: 24px !important;
            font-weight: 700 !important;
            line-height: 1.3 !important;
          }

          /* Adjust image heights for mobile */
          .story-section .image-box,
          .mission-section .image-box {
            height: 280px !important;
          }

          /* What We Offer cards - consistent spacing */
          .offer-section .sec-title {
            margin-bottom: 30px !important;
          }

          /* Offer card heading size */
          .offer-card h4 {
            font-size: 20px !important;
          }

          /* Help card padding adjustment for mobile */
          .help-card {
            padding: 40px 25px !important;
          }
        }

        @media (max-width: 991px) and (min-width: 768px) {
          .order-lg-1 {
            order: 1;
          }
          .order-lg-2 {
            order: 2;
          }
        }
      `}</style>
    </>
  );
};

export default IntroDescriptions;

