"use client";

const OurValues = () => {
  const values = [
    {
      id: 1,
      icon: "la-shield-alt",
      title: "Trust & Safety",
      description: "Every cleaner is verified and reviewed. Our secure payment system and insurance coverage ensure peace of mind for both cleaners and clients."
    },
    {
      id: 2,
      icon: "la-handshake",
      title: "Fair Opportunities",
      description: "We believe in empowering cleaners with fair wages, flexible schedules, and equal access to quality job opportunities."
    },
    {
      id: 3,
      icon: "la-star",
      title: "Quality Service",
      description: "Our rating system and professional standards ensure that clients receive excellent service and cleaners maintain their reputation."
    },
    {
      id: 4,
      icon: "la-headset",
      title: "24/7 Support",
      description: "Our dedicated support team is always available to help resolve issues, answer questions, and ensure smooth operations."
    },
    {
      id: 5,
      icon: "la-lock",
      title: "Secure Payments",
      description: "Transparent pricing, secure transactions, and timely payments. No hidden fees, no surprises just honest, reliable service."
    },
    {
      id: 6,
      icon: "la-chart-line",
      title: "Growth & Development",
      description: "We provide tools, resources, and training opportunities to help cleaners grow their skills and build successful careers."
    }
  ];

  return (
    <section className="our-values-section" style={{ padding: '100px 0', background: '#f5f7fc' }}>
      <div className="auto-container">
        <div className="sec-title text-center">
          <h2>Why Choose Find Cleaner</h2>
          <div className="text">
            Built on values that matter trust, fairness, and excellence
          </div>
        </div>

        <div className="row" style={{ marginTop: '50px' }}>
          {values.map((value) => (
            <div 
              className="col-lg-4 col-md-6 col-sm-12" 
              key={value.id}
              data-aos="fade-up"
              data-aos-delay={value.id * 50}
              style={{ marginBottom: '40px' }}
            >
              <div 
                className="value-block"
                style={{
                  background: 'white',
                  padding: '40px 30px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  border: '1px solid #e8ecec'
                }}
              >
                <div 
                  className="icon"
                  style={{
                    fontSize: '48px',
                    color: '#2aa389',
                    marginBottom: '20px'
                  }}
                >
                  <i className={`la ${value.icon}`}></i>
                </div>
                <h4 style={{ 
                  fontSize: '20px', 
                  fontWeight: '600',
                  marginBottom: '15px',
                  color: '#202124'
                }}>
                  {value.title}
                </h4>
                <p style={{ 
                  fontSize: '15px', 
                  lineHeight: '1.8',
                  color: '#696969',
                  margin: 0
                }}>
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .value-block:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 25px rgba(42, 163, 137, 0.15) !important;
        }
        
        .value-block:hover .icon {
          transform: scale(1.1);
          transition: all 0.3s ease;
        }
      `}</style>
    </section>
  );
};

export default OurValues;
