"use client";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Mitchell",
      role: "Homeowner",
      rating: 5,
      text: "Finding a reliable cleaner was so easy! The background verification gave me peace of mind, and the cleaner did an amazing job. Highly recommended!",
      service: "Regular Cleaning"
    },
    {
      id: 2,
      name: "David Thompson",
      role: "Small Business Owner",
      rating: 5,
      text: "We use Find Cleaner for our office cleaning needs. The platform is professional, the cleaners are vetted, and the pricing is transparent. Perfect service!",
      service: "Commercial Cleaning"
    },
    {
      id: 3,
      name: "Emma Johnson",
      role: "Professional Cleaner",
      rating: 5,
      text: "As a cleaner, this platform has been a game-changer. I get consistent bookings, secure payments, and the support team is always helpful. Love it!",
      service: "Deep Cleaning"
    },
    {
      id: 4,
      name: "Michael Brown",
      role: "Landlord",
      rating: 5,
      text: "Perfect for end-of-tenancy cleaning! Fast booking, professional cleaners, and excellent results. My properties are always inspection-ready.",
      service: "End of Tenancy"
    }
  ];

  return (
    <section className="testimonials-section layout-pt-120 layout-pb-120" style={{ background: "#f5f7fa" }}>
      <div className="auto-container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="sec-title text-center mb-60">
              <h2 className="fw-700">What Our Users Say</h2>
              <div className="text">Real experiences from customers and cleaners on our platform</div>
            </div>
          </div>
        </div>

        <div className="row" data-aos="fade-up">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className="col-lg-6 col-md-6 col-sm-12 mb-30" data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="testimonial-card" style={{ 
                background: "#fff",
                padding: "40px",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                height: "100%",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column"
              }}>
                {/* Service Badge */}
                <span style={{ 
                  display: "inline-block",
                  background: "rgba(42, 163, 137, 0.1)",
                  color: "#2aa389",
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  marginBottom: "20px",
                  alignSelf: "flex-start"
                }}>{testimonial.service}</span>

                {/* Rating */}
                <div style={{ marginBottom: "20px" }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <i key={i} className="la la-star" style={{ color: "#ffa726", fontSize: "18px" }}></i>
                  ))}
                </div>

                {/* Testimonial Text */}
                <p style={{ 
                  fontSize: "16px", 
                  lineHeight: "1.8", 
                  color: "#696969",
                  marginBottom: "30px",
                  fontStyle: "italic",
                  flex: 1
                }}>"{testimonial.text}"</p>

                {/* Author Info */}
                <div style={{ display: "flex", alignItems: "center", marginTop: "auto" }}>
                  <div style={{ 
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "15px"
                  }}>
                    <span style={{ color: "#fff", fontSize: "24px", fontWeight: "600" }}>
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h5 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "5px" }}>{testimonial.name}</h5>
                    <p style={{ fontSize: "14px", color: "#999", marginBottom: "0" }}>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .testimonial-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.12) !important;
        }

        @media (max-width: 767px) {
          .testimonial-card {
            padding: 25px !important;
          }
          .testimonials-section {
            padding: 60px 0 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
