"use client";

import Link from "next/link";

const SupportedCleaningSection = () => {
  const eligibilityGroups = [
    {
      icon: "la la-user-check",
      title: "Elderly Support",
      description: "Subsidised cleaning for seniors who need help maintaining their homes"
    },
    {
      icon: "la la-wheelchair",
      title: "Disability Support",
      description: "Accessible cleaning services for individuals with physical or mental disabilities"
    },
    {
      icon: "la la-hands-helping",
      title: "Financial Hardship",
      description: "Support for families and individuals facing temporary financial difficulty"
    },
    {
      icon: "la la-hospital",
      title: "Healthcare Referrals",
      description: "Priority access through GP, social worker, or carer referrals"
    }
  ];

  return (
    <>
      <section className="supported-cleaning-section">
        <div className="auto-container">
          <div className="section-header text-center">
            <div className="badge-label">
              <span className="la la-heart"></span>
              Community Support
            </div>
            <h2>Supported Cleaning for Those Who Need it Most</h2>
            <p className="subtitle">
              We offer subsidised cleaning services for elderly people, individuals with disabilities,<br />
              and households facing financial difficulty. Support is delivered discreetly and without stigma.
            </p>
          </div>

          <div className="row">
            {eligibilityGroups.map((group, index) => (
              <div key={index} className="col-lg-3 col-md-6 col-sm-12">
                <div className="eligibility-card">
                  <div className="icon-box">
                    <span className={group.icon}></span>
                  </div>
                  <h4>{group.title}</h4>
                  <p>{group.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bottom-content">
            <div className="row align-items-center">
              <div className="col-lg-7">
                <div className="info-box">
                  <h3>How It Works</h3>
                  <ul className="features-list">
                    <li>
                      <span className="la la-check-circle"></span>
                      <span>Eligibility is assessed to ensure support reaches those who need it most</span>
                    </li>
                    <li>
                      <span className="la la-check-circle"></span>
                      <span>All cleaners are fairly compensated - no exploitation</span>
                    </li>
                    <li>
                      <span className="la la-check-circle"></span>
                      <span>Confidential and respectful process with no stigma attached</span>
                    </li>
                    <li>
                      <span className="la la-check-circle"></span>
                      <span>Flexible scheduling and priority booking for urgent needs</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="cta-box">
                  <div className="cta-content">
                    <div className="icon-wrapper">
                      <span className="la la-clipboard-check"></span>
                    </div>
                    <h4>Check Your Eligibility</h4>
                    <p>Quick 2-minute assessment to see if you qualify for subsidised cleaning support</p>
                    <Link href="/check-eligibility" className="theme-btn btn-style-one">
                      <span className="btn-title">Start Eligibility Check</span>
                    </Link>
                    <p className="help-text">
                      Need help? <a href="/contact">Contact our support team</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .supported-cleaning-section {
          padding: 90px 0;
          background: linear-gradient(135deg, #f0faf9 0%, #ffffff 100%);
          position: relative;
          overflow: hidden;
        }
        .section-header {
          margin-bottom: 60px;
          position: relative;
          z-index: 2;
        }
        .badge-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #3B9B98;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 25px;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .badge-label .la {
          font-size: 16px;
        }
        .section-header h2 {
          font-size: 40px;
          font-weight: 700;
          color: #202124;
          margin-bottom: 18px;
          line-height: 1.2;
        }
        .subtitle {
          font-size: 17px;
          color: #5a5a5a;
          line-height: 1.8;
          max-width: 800px;
          margin: 0 auto;
        }
        .eligibility-card {
          background: #fff;
          border-radius: 12px;
          padding: 35px 25px;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid #ecedf2;
          margin-bottom: 30px;
          height: 100%;
        }
        .eligibility-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(59, 155, 152, 0.15);
          border-color: #3B9B98;
        }
        .icon-box {
          width: 70px;
          height: 70px;
          background: #f0faf9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          transition: all 0.3s ease;
          border: 2px solid #e0f2f1;
        }
        .eligibility-card:hover .icon-box {
          background: #3B9B98;
          transform: scale(1.1);
          border-color: #3B9B98;
        }
        .icon-box .la {
          font-size: 32px;
          color: #2F7C7A;
          transition: color 0.3s ease;
        }
        .eligibility-card:hover .icon-box .la {
          color: #ffffff;
        }
        .eligibility-card h4 {
          font-size: 18px;
          font-weight: 600;
          color: #202124;
          margin-bottom: 12px;
        }
        .eligibility-card p {
          font-size: 14px;
          color: #696969;
          line-height: 1.6;
          margin: 0;
        }
        .bottom-content {
          margin-top: 60px;
          position: relative;
          z-index: 2;
        }
        .info-box {
          background: #fff;
          border-radius: 16px;
          padding: 40px;
          border: 1px solid #ecedf2;
        }
        .info-box h3 {
          font-size: 26px;
          font-weight: 700;
          color: #202124;
          margin-bottom: 25px;
        }
        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .features-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 18px;
          font-size: 15px;
          color: #5a5a5a;
          line-height: 1.7;
        }
        .features-list li:last-child {
          margin-bottom: 0;
        }
        .features-list .la {
          font-size: 22px;
          color: #3B9B98;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .cta-box {
          background: linear-gradient(135deg, #3B9B98 0%, #2F7C7A 100%);
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 15px 40px rgba(59, 155, 152, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .icon-wrapper {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }
        .icon-wrapper .la {
          font-size: 38px;
          color: #ffffff;
        }
        .cta-content h4 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 12px;
        }
        .cta-content p {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          margin-bottom: 25px;
        }
        .theme-btn {
          display: inline-block;
          padding: 15px 32px;
          background: #ffffff;
          color: #2F7C7A;
          border-radius: 8px;
          font-weight: 700;
          font-size: 15px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .theme-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          background: #f0faf9;
        }
        .help-text {
          font-size: 13px !important;
          color: rgba(255, 255, 255, 0.8) !important;
          margin-top: 15px !important;
        }
        .help-text a {
          color: #fff;
          text-decoration: underline;
        }
        @media (max-width: 991px) {
          .section-header h2 {
            font-size: 34px;
          }
          .subtitle {
            font-size: 16px;
          }
          .info-box {
            margin-bottom: 30px;
          }
          .cta-box {
            padding: 35px;
          }
        }

        @media (max-width: 767px) {
          .supported-cleaning-section {
            padding: 60px 0;
          }
          .section-header {
            margin-bottom: 50px;
          }
          .section-header h2 {
            font-size: 30px;
            margin-bottom: 15px;
          }
          .subtitle {
            font-size: 15px;
          }
          .eligibility-card {
            padding: 30px 20px;
            margin-bottom: 20px;
          }
          .icon-box {
            width: 65px;
            height: 65px;
          }
          .icon-box .la {
            font-size: 30px;
          }
          .eligibility-card h4 {
            font-size: 17px;
          }
          .bottom-content {
            margin-top: 50px;
          }
          .info-box {
            padding: 30px 25px;
          }
          .info-box h3 {
            font-size: 24px;
            margin-bottom: 20px;
          }
          .features-list li {
            font-size: 14px;
            margin-bottom: 15px;
          }
          .cta-box {
            padding: 30px 25px;
          }
          .cta-content h4 {
            font-size: 22px;
          }
          .cta-content p {
            font-size: 14px;
          }
        }

        @media (max-width: 576px) {
          .supported-cleaning-section {
            padding: 50px 0;
          }
          .section-header h2 {
            font-size: 28px;
          }
          .bottom-content {
            margin-top: 40px;
          }
        }

        @media (max-width: 480px) {
          .supported-cleaning-section {
            padding: 40px 0;
          }
          .section-header {
            margin-bottom: 40px;
          }
          .section-header h2 {
            font-size: 26px;
          }
          .subtitle {
            font-size: 14px;
          }
          .badge-label {
            font-size: 11px;
            padding: 7px 14px;
          }
          .eligibility-card {
            padding: 25px 18px;
          }
          .icon-box {
            width: 60px;
            height: 60px;
          }
          .icon-box .la {
            font-size: 28px;
          }
          .eligibility-card h4 {
            font-size: 16px;
          }
          .eligibility-card p {
            font-size: 13px;
          }
          .info-box {
            padding: 25px 20px;
          }
          .info-box h3 {
            font-size: 22px;
          }
          .features-list li {
            font-size: 13px;
          }
          .features-list .la {
            font-size: 20px;
          }
          .cta-box {
            padding: 25px 20px;
          }
          .icon-wrapper {
            width: 70px;
            height: 70px;
          }
          .icon-wrapper .la {
            font-size: 34px;
          }
          .cta-content h4 {
            font-size: 20px;
          }
          .theme-btn {
            width: 100%;
            padding: 14px 24px;
          }
        }
      `}</style>
    </>
  );
};

export default SupportedCleaningSection;
