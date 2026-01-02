"use client";

const HowItWorksSection = () => {
  return (
    <section className="how-it-works-section layout-pt-120 layout-pb-120" style={{ background: "#f9fafb" }}>
      <div className="auto-container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="sec-title text-center mb-60">
              <h2 className="fw-700">How It Works</h2>
              <div className="text">Simple steps to connect customers with professional cleaners</div>
            </div>
          </div>
        </div>

        {/* For Customers */}
        <div className="mb-80">
          <div className="text-center mb-40">
            <span className="badge" style={{ 
              background: "#2aa389", 
              color: "#fff", 
              padding: "8px 20px", 
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600"
            }}>For Customers</span>
          </div>
          <div className="row">
            {/* Step 1 */}
            <div className="col-lg-4 col-md-4" data-aos="fade-up" data-aos-delay="0">
              <div className="step-card text-center" style={{ position: "relative" }}>
                <div className="step-icon" style={{ 
                  width: "90px", 
                  height: "90px", 
                  background: "linear-gradient(135deg, #2aa389 0%, #1e8c73 100%)",
                  borderRadius: "50%",
                  margin: "0 auto 25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative"
                }}>
                  <i className="la la-search" style={{ fontSize: "42px", color: "#fff" }}></i>
                  <span style={{ 
                    position: "absolute", 
                    top: "-10px", 
                    right: "-10px", 
                    width: "35px", 
                    height: "35px", 
                    background: "#667eea", 
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "16px"
                  }}>1</span>
                </div>
                <h4 className="fw-600 mb-15">Search & Compare</h4>
                <p style={{ color: "#696969", lineHeight: "1.8" }}>Browse verified cleaners in your area and compare ratings, reviews, and prices</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="col-lg-4 col-md-4" data-aos="fade-up" data-aos-delay="100">
              <div className="step-card text-center" style={{ position: "relative" }}>
                <div className="step-icon" style={{ 
                  width: "90px", 
                  height: "90px", 
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "50%",
                  margin: "0 auto 25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative"
                }}>
                  <i className="la la-calendar-check" style={{ fontSize: "42px", color: "#fff" }}></i>
                  <span style={{ 
                    position: "absolute", 
                    top: "-10px", 
                    right: "-10px", 
                    width: "35px", 
                    height: "35px", 
                    background: "#667eea", 
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "16px"
                  }}>2</span>
                </div>
                <h4 className="fw-600 mb-15">Book Instantly</h4>
                <p style={{ color: "#696969", lineHeight: "1.8" }}>Select your preferred cleaner, choose date and time, and book with one click</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="col-lg-4 col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="step-card text-center">
                <div className="step-icon" style={{ 
                  width: "90px", 
                  height: "90px", 
                  background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  borderRadius: "50%",
                  margin: "0 auto 25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative"
                }}>
                  <i className="la la-home" style={{ fontSize: "42px", color: "#fff" }}></i>
                  <span style={{ 
                    position: "absolute", 
                    top: "-10px", 
                    right: "-10px", 
                    width: "35px", 
                    height: "35px", 
                    background: "#667eea", 
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "16px"
                  }}>3</span>
                </div>
                <h4 className="fw-600 mb-15">Enjoy Clean Space</h4>
                <p style={{ color: "#696969", lineHeight: "1.8" }}>Relax while professionals handle the cleaning, then rate your experience</p>
              </div>
            </div>
          </div>
        </div>

        {/* For Cleaners */}
        <div>
          <div className="text-center mb-40">
            <span className="badge" style={{ 
              background: "#667eea", 
              color: "#fff", 
              padding: "8px 20px", 
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600"
            }}>For Cleaners</span>
          </div>
          <div className="row">
            {/* Step 1 */}
            <div className="col-lg-4 col-md-4" data-aos="fade-up" data-aos-delay="0">
              <div className="step-card text-center">
                <div className="step-icon" style={{ 
                  width: "90px", 
                  height: "90px", 
                  background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                  borderRadius: "50%",
                  margin: "0 auto 25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative"
                }}>
                  <i className="la la-user-plus" style={{ fontSize: "42px", color: "#fff" }}></i>
                  <span style={{ 
                    position: "absolute", 
                    top: "-10px", 
                    right: "-10px", 
                    width: "35px", 
                    height: "35px", 
                    background: "#667eea", 
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "16px"
                  }}>1</span>
                </div>
                <h4 className="fw-600 mb-15">Create Profile</h4>
                <p style={{ color: "#696969", lineHeight: "1.8" }}>Sign up, complete background verification, and showcase your skills</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="col-lg-4 col-md-4" data-aos="fade-up" data-aos-delay="100">
              <div className="step-card text-center">
                <div className="step-icon" style={{ 
                  width: "90px", 
                  height: "90px", 
                  background: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
                  borderRadius: "50%",
                  margin: "0 auto 25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative"
                }}>
                  <i className="la la-bell" style={{ fontSize: "42px", color: "#fff" }}></i>
                  <span style={{ 
                    position: "absolute", 
                    top: "-10px", 
                    right: "-10px", 
                    width: "35px", 
                    height: "35px", 
                    background: "#667eea", 
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "16px"
                  }}>2</span>
                </div>
                <h4 className="fw-600 mb-15">Receive Bookings</h4>
                <p style={{ color: "#696969", lineHeight: "1.8" }}>Get notified when customers book you, manage your schedule flexibly</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="col-lg-4 col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="step-card text-center">
                <div className="step-icon" style={{ 
                  width: "90px", 
                  height: "90px", 
                  background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
                  borderRadius: "50%",
                  margin: "0 auto 25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative"
                }}>
                  <i className="la la-money-bill-wave" style={{ fontSize: "42px", color: "#fff" }}></i>
                  <span style={{ 
                    position: "absolute", 
                    top: "-10px", 
                    right: "-10px", 
                    width: "35px", 
                    height: "35px", 
                    background: "#667eea", 
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "16px"
                  }}>3</span>
                </div>
                <h4 className="fw-600 mb-15">Get Paid</h4>
                <p style={{ color: "#696969", lineHeight: "1.8" }}>Complete jobs, receive secure payments, and build your reputation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 767px) {
          .step-icon {
            width: 70px !important;
            height: 70px !important;
          }
          .step-icon i {
            font-size: 32px !important;
          }
          .mb-80 {
            margin-bottom: 50px !important;
          }
          .how-it-works-section {
            padding: 60px 0 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HowItWorksSection;
