"use client";

const ImpactStats = () => {
  const stats = [
    {
      number: "24",
      label: "Cleaners Trained",
      description: "Supported with certification",
      icon: "flaticon-resume"
    },
    {
      number: "18",
      label: "Subsidised Cleans",
      description: "For vulnerable residents",
      icon: "flaticon-home-1"
    },
    {
      number: "65%",
      label: "Profits Reinvested",
      description: "Into community programmes",
      icon: "flaticon-money-1"
    },
    {
      number: "5",
      label: "Community Partners",
      description: "Local organisations",
      icon: "flaticon-network"
    }
  ];

  return (
    <>
      <section className="impact-stats-section">
        <div className="auto-container">
          <div className="sec-title text-center">
            <h2>Our Impact So Far</h2>
            <div className="text">Real results from our community programmes</div>
          </div>

          <div className="row">
            {stats.map((stat, index) => (
              <div key={index} className="counter-column col-lg-3 col-md-6 col-sm-12">
                <div className="count-box">
                  <div className="icon-box">
                    <span className={`icon ${stat.icon}`}></span>
                  </div>
                  <div className="count-number">{stat.number}</div>
                  <h4 className="counter-title">{stat.label}</h4>
                  <div className="description">{stat.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .impact-stats-section {
          padding: 100px 0;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          position: relative;
          overflow: hidden;
        }
        .impact-stats-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 300px;
          background: linear-gradient(135deg, rgba(25, 103, 210, 0.05) 0%, rgba(52, 168, 83, 0.05) 100%);
          z-index: 0;
        }
        .auto-container {
          position: relative;
          z-index: 1;
        }
        .sec-title {
          margin-bottom: 60px;
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
        .counter-column {
          margin-bottom: 30px;
        }
        .count-box {
          background: #fff;
          border-radius: 12px;
          padding: 45px 30px;
          text-align: center;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.4s ease;
          height: 100%;
          border: 2px solid transparent;
        }
        .count-box:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(25, 103, 210, 0.15);
          border-color: #1967d2;
        }
        .icon-box {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #e8f0fe 0%, #d2e3fc 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 25px;
          transition: all 0.3s ease;
        }
        .count-box:hover .icon-box {
          background: linear-gradient(135deg, #1967d2 0%, #155db1 100%);
          transform: rotate(360deg);
        }
        .icon-box .icon {
          font-size: 32px;
          color: #1967d2;
          transition: color 0.3s ease;
        }
        .count-box:hover .icon-box .icon {
          color: #fff;
        }
        .count-number {
          font-size: 48px;
          font-weight: 700;
          color: #1967d2;
          margin-bottom: 10px;
          line-height: 1;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .counter-title {
          font-size: 18px;
          font-weight: 600;
          color: #202124;
          margin-bottom: 8px;
        }
        .description {
          font-size: 14px;
          color: #696969;
        }
        @media (max-width: 991px) {
          .count-box {
            padding: 35px 25px;
          }
        }
        @media (max-width: 767px) {
          .impact-stats-section {
            padding: 60px 0;
          }
          .sec-title h2 {
            font-size: 28px;
          }
          .count-number {
            font-size: 40px;
          }
          .counter-title {
            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
};

export default ImpactStats;
