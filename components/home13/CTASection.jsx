"use client";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="cta-section layout-pt-60 layout-pb-60">
      <div className="auto-container">
        <div className="row">
          {/* CTA for Customers */}
          <div className="col-lg-6 col-md-12" data-aos="fade-right">
            <div className="cta-card" style={{ 
              background: "linear-gradient(135deg, #2aa389 0%, #1e8c73 100%)",
              padding: "50px 40px",
              borderRadius: "16px",
              position: "relative",
              overflow: "hidden",
              height: "100%",
              minHeight: "380px"
            }}>
              {/* Background Pattern */}
              <div style={{ 
                position: "absolute",
                top: 0,
                right: 0,
                width: "200px",
                height: "200px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "50%",
                transform: "translate(50%, -50%)"
              }}></div>
              
              <div style={{ position: "relative", zIndex: 1 }}>
                {/* Icon */}
                <div style={{ 
                  width: "70px",
                  height: "70px",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "25px"
                }}>
                  <i className="la la-search" style={{ fontSize: "36px", color: "#fff" }}></i>
                </div>

                {/* Content */}
                <h3 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", marginBottom: "15px" }}>
                  Need a Cleaner?
                </h3>
                <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px", lineHeight: "1.8", marginBottom: "25px" }}>
                  Find verified, professional cleaners in your area. Compare ratings, read reviews, and book instantly.
                </p>

                {/* Benefits */}
                <ul style={{ listStyle: "none", padding: 0, marginBottom: "30px" }}>
                  <li style={{ color: "#fff", marginBottom: "12px", display: "flex", alignItems: "center" }}>
                    <i className="la la-check-circle" style={{ fontSize: "20px", marginRight: "10px" }}></i>
                    Background-verified cleaners
                  </li>
                  <li style={{ color: "#fff", marginBottom: "12px", display: "flex", alignItems: "center" }}>
                    <i className="la la-check-circle" style={{ fontSize: "20px", marginRight: "10px" }}></i>
                    Instant booking & secure payments
                  </li>
                  <li style={{ color: "#fff", marginBottom: "12px", display: "flex", alignItems: "center" }}>
                    <i className="la la-check-circle" style={{ fontSize: "20px", marginRight: "10px" }}></i>
                    Satisfaction guarantee
                  </li>
                </ul>

                {/* CTA Button */}
                <Link href="/cleaners">
                  <button className="cta-btn" style={{ 
                    background: "#fff",
                    color: "#2aa389",
                    padding: "16px 40px",
                    borderRadius: "50px",
                    border: "none",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                  }}>
                    Find Cleaners Now
                    <i className="la la-arrow-right" style={{ marginLeft: "8px" }}></i>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* CTA for Cleaners */}
          <div className="col-lg-6 col-md-12" data-aos="fade-left">
            <div className="cta-card" style={{ 
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "50px 40px",
              borderRadius: "16px",
              position: "relative",
              overflow: "hidden",
              height: "100%",
              minHeight: "380px"
            }}>
              {/* Background Pattern */}
              <div style={{ 
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "200px",
                height: "200px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "50%",
                transform: "translate(-50%, 50%)"
              }}></div>
              
              <div style={{ position: "relative", zIndex: 1 }}>
                {/* Icon */}
                <div style={{ 
                  width: "70px",
                  height: "70px",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "25px"
                }}>
                  <i className="la la-user-tie" style={{ fontSize: "36px", color: "#fff" }}></i>
                </div>

                {/* Content */}
                <h3 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", marginBottom: "15px" }}>
                  Are You a Cleaner?
                </h3>
                <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px", lineHeight: "1.8", marginBottom: "25px" }}>
                  Join thousands of cleaners earning on their own schedule. Get bookings, build your reputation, and grow your business.
                </p>

                {/* Benefits */}
                <ul style={{ listStyle: "none", padding: 0, marginBottom: "30px" }}>
                  <li style={{ color: "#fff", marginBottom: "12px", display: "flex", alignItems: "center" }}>
                    <i className="la la-check-circle" style={{ fontSize: "20px", marginRight: "10px" }}></i>
                    Flexible schedule & earnings
                  </li>
                  <li style={{ color: "#fff", marginBottom: "12px", display: "flex", alignItems: "center" }}>
                    <i className="la la-check-circle" style={{ fontSize: "20px", marginRight: "10px" }}></i>
                    Secure & timely payments
                  </li>
                  <li style={{ color: "#fff", marginBottom: "12px", display: "flex", alignItems: "center" }}>
                    <i className="la la-check-circle" style={{ fontSize: "20px", marginRight: "10px" }}></i>
                    Professional support & insurance
                  </li>
                </ul>

                {/* CTA Button */}
                <Link href="/auth">
                  <button className="cta-btn" style={{ 
                    background: "#fff",
                    color: "#667eea",
                    padding: "16px 40px",
                    borderRadius: "50px",
                    border: "none",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                  }}>
                    Start Earning Today
                    <i className="la la-arrow-right" style={{ marginLeft: "8px" }}></i>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .cta-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important;
        }

        @media (max-width: 991px) {
          .cta-card {
            margin-bottom: 30px;
            min-height: auto !important;
          }
        }

        @media (max-width: 767px) {
          .cta-card {
            padding: 35px 25px !important;
          }
          .cta-card h3 {
            font-size: 24px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default CTASection;
