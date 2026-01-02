"use client";

const CommunityImpactSection = () => {
  const features = [
    {
      icon: "la la-shield-alt",
      title: "Verified & Background Checked",
      description: "All cleaners are thoroughly vetted with background checks and verified credentials for your peace of mind."
    },
    {
      icon: "la la-pound-sign",
      title: "Fair Pay Guaranteed",
      description: "We ensure cleaners receive fair wages, with no race-to-the-bottom pricing or exploitation."
    },
    {
      icon: "la la-graduation-cap",
      title: "Training & Development",
      description: "Continuous skill development and certification programmes for professional growth."
    }
  ];

  return (
    <>
      <section className="cleaning-work-section">
        <div className="auto-container">
          <div className="row align-items-center">
            <div className="col-lg-5">
              <div className="content-column">
                <div className="badge-label">
                  <span className="la la-star"></span>
                  Why Choose Us
                </div>
                <h2>Cleaning Work That Respects You</h2>
                <p>
                  Fair & transparent pricing that conserves quality. We connect you with 
                  verified, trustworthy cleaners while ensuring fair treatment for everyone.
                </p>
                <a href="/about" className="theme-btn btn-style-one">
                  <span className="btn-title">Learn More About Us</span>
                </a>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="features-column">
                {features.map((feature, index) => (
                  <div key={index} className="feature-card">
                    <div className="icon-box">
                      <span className={feature.icon}></span>
                    </div>
                    <div className="text">
                      <h4>{feature.title}</h4>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .cleaning-work-section {
          padding: 100px 0;
          background: #f8faff;
        }
        .content-column {
          padding-right: 40px;
        }
        .badge-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #3B9B98;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 25px;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .badge-label .la {
          font-size: 14px;
        }
        .content-column h2 {
          font-size: 38px;
          font-weight: 700;
          color: #202124;
          margin-bottom: 20px;
          line-height: 1.2;
        }
        .content-column p {
          font-size: 16px;
          color: #5a5a5a;
          line-height: 1.8;
          margin-bottom: 30px;
        }
        .theme-btn {
          display: inline-block;
          padding: 14px 32px;
          background: #3B9B98;
          color: #fff;
          border-radius: 8px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .theme-btn:hover {
          background: #2F7C7A;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 155, 152, 0.25);
        }
        .features-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .feature-card {
          background: #fff;
          border-radius: 12px;
          padding: 30px;
          display: flex;
          gap: 20px;
          align-items: flex-start;
          transition: all 0.3s ease;
          border: 1px solid #ecedf2;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
        }
        .feature-card:hover {
          transform: translateX(10px);
          box-shadow: 0 10px 30px rgba(59, 155, 152, 0.1);
          border-color: #3B9B98;
        }
        .icon-box {
          width: 60px;
          height: 60px;
          background: #f0faf9;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s ease;
          border: 2px solid #e0f2f1;
        }
        .feature-card:hover .icon-box {
          background: #3B9B98;
          border-color: #3B9B98;
        }
        .icon-box .la {
          font-size: 28px;
          color: #2F7C7A;
          transition: color 0.3s ease;
        }
        .feature-card:hover .icon-box .la {
          color: #ffffff;
        }
        .text h4 {
          font-size: 18px;
          font-weight: 600;
          color: #202124;
          margin-bottom: 8px;
        }
        .text p {
          font-size: 14px;
          color: #696969;
          line-height: 1.6;
          margin: 0;
        }
        @media (max-width: 991px) {
          .cleaning-work-section {
            padding: 80px 0;
          }
          .content-column {
            padding-right: 0;
            text-align: center;
            margin-bottom: 50px;
          }
          .content-column h2 {
            font-size: 32px;
          }
          .content-column p {
            font-size: 15px;
          }
          .feature-card:hover {
            transform: translateY(-5px);
          }
          .badge-label {
            display: inline-flex;
          }
        }

        @media (max-width: 767px) {
          .cleaning-work-section {
            padding: 60px 0;
          }
          .content-column {
            margin-bottom: 40px;
          }
          .content-column h2 {
            font-size: 28px;
            margin-bottom: 15px;
          }
          .content-column p {
            font-size: 15px;
            margin-bottom: 25px;
          }
          .theme-btn {
            padding: 12px 28px;
            font-size: 14px;
          }
          .features-column {
            gap: 18px;
          }
          .feature-card {
            padding: 25px 20px;
          }
          .icon-box {
            width: 55px;
            height: 55px;
          }
          .icon-box .la {
            font-size: 26px;
          }
          .text h4 {
            font-size: 17px;
          }
        }

        @media (max-width: 576px) {
          .cleaning-work-section {
            padding: 50px 0;
          }
          .content-column h2 {
            font-size: 26px;
          }
          .features-column {
            gap: 15px;
          }
          .feature-card {
            padding: 22px 18px;
          }
        }

        @media (max-width: 480px) {
          .cleaning-work-section {
            padding: 40px 0;
          }
          .content-column h2 {
            font-size: 24px;
          }
          .content-column p {
            font-size: 14px;
          }
          .badge-label {
            font-size: 11px;
            padding: 7px 14px;
          }
          .feature-card {
            padding: 20px 16px;
          }
          .icon-box {
            width: 50px;
            height: 50px;
          }
          .icon-box .la {
            font-size: 24px;
          }
          .text h4 {
            font-size: 16px;
          }
          .text p {
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
};

export default CommunityImpactSection;
