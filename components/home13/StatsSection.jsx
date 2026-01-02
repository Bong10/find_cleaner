"use client";

const StatsSection = () => {
  return (
    <section className="stats-section" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "80px 0" }}>
      <div className="auto-container">
        <div className="row">
          {/* Stat 1 */}
          <div className="col-lg-3 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="0">
            <div className="stat-card text-center">
              <div className="icon-box" style={{ 
                width: "90px", 
                height: "90px", 
                background: "rgba(255,255,255,0.2)", 
                borderRadius: "50%", 
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease"
              }}>
                <i className="la la-users" style={{ fontSize: "48px", color: "#fff" }}></i>
              </div>
              <h2 style={{ color: "#fff", fontSize: "42px", fontWeight: "700", marginBottom: "10px" }}>5,000+</h2>
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px", marginBottom: "0" }}>Verified Cleaners</p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="col-lg-3 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="100">
            <div className="stat-card text-center">
              <div className="icon-box" style={{ 
                width: "90px", 
                height: "90px", 
                background: "rgba(255,255,255,0.2)", 
                borderRadius: "50%", 
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease"
              }}>
                <i className="la la-briefcase" style={{ fontSize: "48px", color: "#fff" }}></i>
              </div>
              <h2 style={{ color: "#fff", fontSize: "42px", fontWeight: "700", marginBottom: "10px" }}>50,000+</h2>
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px", marginBottom: "0" }}>Jobs Completed</p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="col-lg-3 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="200">
            <div className="stat-card text-center">
              <div className="icon-box" style={{ 
                width: "90px", 
                height: "90px", 
                background: "rgba(255,255,255,0.2)", 
                borderRadius: "50%", 
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease"
              }}>
                <i className="la la-smile" style={{ fontSize: "48px", color: "#fff" }}></i>
              </div>
              <h2 style={{ color: "#fff", fontSize: "42px", fontWeight: "700", marginBottom: "10px" }}>98%</h2>
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px", marginBottom: "0" }}>Satisfaction Rate</p>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="col-lg-3 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="300">
            <div className="stat-card text-center">
              <div className="icon-box" style={{ 
                width: "90px", 
                height: "90px", 
                background: "rgba(255,255,255,0.2)", 
                borderRadius: "50%", 
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease"
              }}>
                <i className="la la-map-marker" style={{ fontSize: "48px", color: "#fff" }}></i>
              </div>
              <h2 style={{ color: "#fff", fontSize: "42px", fontWeight: "700", marginBottom: "10px" }}>200+</h2>
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px", marginBottom: "0" }}>Cities Covered</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stat-card:hover .icon-box {
          transform: scale(1.1);
          background: rgba(255,255,255,0.3);
        }

        @media (max-width: 767px) {
          .icon-box {
            width: 60px !important;
            height: 60px !important;
          }
          .icon-box i {
            font-size: 32px !important;
          }
          h2 {
            font-size: 32px !important;
          }
          .stats-section {
            padding: 50px 0 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default StatsSection;
