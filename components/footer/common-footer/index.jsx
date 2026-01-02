"use client";

import Image from "next/image";
import CopyrightFooter from "./CopyrightFooter";

const index = ({ footerStyle = "" }) => {
  return (
    <>
      <footer className={`main-footer ${footerStyle}`}>
        {/* CIC Statement Section */}
        <div className="cic-footer-section">
          <div className="auto-container">
            <div className="cic-wrapper">
              <div className="row align-items-center">
                <div className="col-lg-6 col-md-12">
                  <div className="cic-content">
                    <div className="badge-label">
                      <span className="la la-certificate"></span>
                      Community Interest Company
                    </div>
                    <h4>Find Cleaner CIC</h4>
                    <p>
                      A social enterprise reinvesting profits into fair pay, training, and 
                      subsidised cleaning support for vulnerable households across the UK.
                    </p>
                    <div className="cic-links">
                      <a href="/community-impact" className="cic-link">
                        Community Impact
                        <span className="la la-arrow-right"></span>
                      </a>
                      <a href="/support-programmes" className="cic-link">
                        Support Programmes
                        <span className="la la-arrow-right"></span>
                      </a>
                      <a href="/check-eligibility" className="cic-link">
                        Check Eligibility
                        <span className="la la-arrow-right"></span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12">
                  <div className="cic-features">
                    <div className="feature-item">
                      <div className="feature-icon">
                        <span className="la la-hand-holding-usd"></span>
                      </div>
                      <div className="feature-text">
                        <h5>Fair Pay Promise</h5>
                        <p>Living wages and fair rates for every cleaner</p>
                      </div>
                    </div>
                    <div className="feature-item">
                      <div className="feature-icon">
                        <span className="la la-hands-helping"></span>
                      </div>
                      <div className="feature-text">
                        <h5>Community Support</h5>
                        <p>Subsidised services for those in need</p>
                      </div>
                    </div>
                    <div className="feature-item">
                      <div className="feature-icon">
                        <span className="la la-graduation-cap"></span>
                      </div>
                      <div className="feature-text">
                        <h5>Skills Training</h5>
                        <p>Professional development for cleaners</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End CIC Section */}

        <CopyrightFooter />
        {/* <!--Bottom--> */}
      </footer>

      <style jsx>{`
        .cic-footer-section {
          background: #fff;
          padding: 50px 0;
          border-top: 1px solid #ecedf2;
        }
        .cic-wrapper {
          background: linear-gradient(135deg, #f0faf9 0%, #ffffff 100%);
          border-radius: 20px;
          padding: 50px 45px;
          border: 1px solid #d5e8e7;
        }
        .cic-content .badge-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #3B9B98;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          padding: 7px 16px;
          border-radius: 20px;
          margin-bottom: 18px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .cic-content .badge-label .la {
          font-size: 14px;
        }
        .cic-content h4 {
          font-size: 32px;
          font-weight: 700;
          color: #202124;
          margin-bottom: 15px;
          line-height: 1.2;
        }
        .cic-content p {
          font-size: 16px;
          color: #5a5a5a;
          line-height: 1.8;
          margin-bottom: 30px;
          max-width: 500px;
        }
        .cic-links {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }
        .cic-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #3B9B98;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          padding: 10px 18px;
          background: rgba(59, 155, 152, 0.08);
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .cic-link .la {
          font-size: 13px;
          transition: transform 0.3s ease;
        }
        .cic-link:hover {
          background: #3B9B98;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(59, 155, 152, 0.2);
        }
        .cic-link:hover .la {
          transform: translateX(3px);
        }
        .cic-features {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          background: #fff;
          padding: 22px;
          border-radius: 12px;
          transition: all 0.3s ease;
          border: 1px solid #e3ebf6;
        }
        .feature-item:hover {
          transform: translateX(5px);
          box-shadow: 0 8px 25px rgba(59, 155, 152, 0.1);
          border-color: #3B9B98;
        }
        .feature-icon {
          width: 50px;
          height: 50px;
          background: #f0faf9;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s ease;
          border: 2px solid #e0f2f1;
        }
        .feature-item:hover .feature-icon {
          background: #3B9B98;
          border-color: #3B9B98;
        }
        .feature-icon .la {
          font-size: 24px;
          color: #2F7C7A;
          transition: color 0.3s ease;
        }
        .feature-item:hover .feature-icon .la {
          color: #ffffff;
        }
        .feature-text h5 {
          font-size: 16px;
          font-weight: 700;
          color: #202124;
          margin-bottom: 5px;
          line-height: 1.3;
        }
        .feature-text p {
          font-size: 14px;
          color: #696969;
          line-height: 1.6;
          margin: 0;
        }
        @media (max-width: 991px) {
          .cic-features {
            margin-top: 40px;
          }
        }
        @media (max-width: 767px) {
          .cic-footer-section {
            padding: 40px 0;
          }
          .cic-wrapper {
            padding: 35px 25px;
          }
          .cic-content h4 {
            font-size: 26px;
          }
          .cic-features {
            margin-top: 30px;
          }
        }
      `}</style>
    </>
  );
};

export default index;
