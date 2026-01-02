"use client";

const CicBanner = () => {
  return (
    <>
      <section className="cic-banner">
        <div className="auto-container">
          <div className="banner-inner">
            <div className="content">
              <div className="badge-text">
                <span className="la la-certificate"></span>
                UK Community Interest Company
              </div>
              <h3>More Than a Booking Platform</h3>
              <p>
                Find Cleaner is a Community Interest Company (CIC). We operate a sustainable 
                marketplace open to everyone, while reinvesting to support those in need and 
                financially vulnerable households with subsidised cleaning services.
              </p>
            </div>
            <div className="features">
              <div className="feature-item">
                <div className="icon-box">
                  <span className="la la-hand-holding-usd"></span>
                </div>
                <div className="text">
                  <h4>Fair Work for Cleaners</h4>
                  <ul>
                    <li>Minimum pay thresholds</li>
                    <li>No undercutting or race to the bottom pricing</li>
                  </ul>
                </div>
              </div>
              <div className="feature-item">
                <div className="icon-box">
                  <span className="la la-home"></span>
                </div>
                <div className="text">
                  <h4>Dignified Support for Households</h4>
                  <ul>
                    <li>Subsidised rates for those who need it</li>
                    <li>Referral pathways via carers, social workers</li>
                    <li>Priority and longer bookings when required</li>
                  </ul>
                </div>
              </div>
              <div className="feature-item">
                <div className="icon-box">
                  <span className="la la-sync"></span>
                </div>
                <div className="text">
                  <h4>Reinvestment Into Communities</h4>
                  <ul>
                    <li>Surplus reinvested, not extracted</li>
                    <li>Local pilot cities partnering with us</li>
                    <li>Scalable across the UK</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .cic-banner {
          padding: 80px 0;
          background: #fff;
        }
        .banner-inner {
          background: #fff;
          border-radius: 16px;
          padding: 0;
        }
        .content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 60px;
        }
        .badge-text {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #3B9B98;
          color: #ffffff;
          font-size: 13px;
          font-weight: 600;
          padding: 10px 20px;
          border-radius: 25px;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .badge-text .la {
          font-size: 18px;
          color: #ffffff;
        }
        .content h3 {
          font-size: 36px;
          font-weight: 700;
          color: #202124;
          margin-bottom: 20px;
          line-height: 1.3;
        }
        .content p {
          font-size: 17px;
          color: #5a5a5a;
          line-height: 1.8;
          margin: 0;
        }
        .features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }
        .feature-item {
          background: #ffffff;
          border-radius: 12px;
          padding: 35px 30px;
          transition: all 0.3s ease;
          border: 2px solid #e0f2f1;
        }
        .feature-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(59, 155, 152, 0.15);
          border-color: #3B9B98;
        }
        .icon-box {
          width: 60px;
          height: 60px;
          background: #3B9B98;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }
        .icon-box .la {
          font-size: 28px;
          color: #ffffff;
        }
        .feature-item h4 {
          font-size: 18px;
          font-weight: 600;
          color: #202124;
          margin-bottom: 15px;
        }
        .feature-item ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .feature-item ul li {
          font-size: 14px;
          color: #5a5a5a;
          padding: 6px 0;
          padding-left: 22px;
          position: relative;
          line-height: 1.5;
        }
        .feature-item ul li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #3B9B98;
          font-weight: 700;
          font-size: 16px;
        }
        @media (max-width: 991px) {
          .features {
            grid-template-columns: 1fr;
            gap: 25px;
          }
          .content {
            margin-bottom: 50px;
          }
          .content h3 {
            font-size: 30px;
          }
          .content p {
            font-size: 16px;
          }
        }

        @media (max-width: 767px) {
          .cic-banner {
            padding: 50px 0;
          }
          .content {
            margin-bottom: 40px;
          }
          .content h3 {
            font-size: 26px;
            margin-bottom: 15px;
          }
          .content p {
            font-size: 15px;
          }
          .badge-text {
            font-size: 12px;
            padding: 8px 16px;
          }
          .feature-item {
            padding: 25px 20px;
          }
          .icon-box {
            width: 55px;
            height: 55px;
          }
          .icon-box .la {
            font-size: 26px;
          }
          .feature-item h4 {
            font-size: 17px;
          }
        }

        @media (max-width: 576px) {
          .cic-banner {
            padding: 40px 0;
          }
          .content h3 {
            font-size: 24px;
          }
          .features {
            gap: 20px;
          }
        }

        @media (max-width: 480px) {
          .cic-banner {
            padding: 35px 0;
          }
          .content h3 {
            font-size: 22px;
          }
          .content p {
            font-size: 14px;
          }
          .feature-item {
            padding: 20px 18px;
          }
          .icon-box {
            width: 50px;
            height: 50px;
          }
          .icon-box .la {
            font-size: 24px;
          }
          .feature-item h4 {
            font-size: 16px;
            margin-bottom: 12px;
          }
          .feature-item ul li {
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
};

export default CicBanner;
