"use client";

const GuaranteesSection = () => {
  const guarantees = [
    {
      id: 1,
      icon: "la-shield-alt",
      title: "Background Verified",
      description: "All cleaners undergo thorough background checks and verification",
      color: "#2aa389"
    },
    {
      id: 2,
      icon: "la-file-contract",
      title: "Fully Insured",
      description: "Every professional is insured for your peace of mind",
      color: "#667eea"
    },
    {
      id: 3,
      icon: "la-lock",
      title: "Secure Payments",
      description: "Bank-level encryption protects all your transactions",
      color: "#f5576c"
    },
    {
      id: 4,
      icon: "la-smile-beam",
      title: "Satisfaction Guarantee",
      description: "Not happy? We'll make it right or refund you",
      color: "#fbbf24"
    },
    {
      id: 5,
      icon: "la-undo",
      title: "Free Cancellation",
      description: "Cancel up to 24 hours before your booking at no charge",
      color: "#4facfe"
    },
    {
      id: 6,
      icon: "la-headset",
      title: "24/7 Support",
      description: "Our support team is always here to help you",
      color: "#f093fb"
    }
  ];

  return (
    <section className="guarantees-section" style={{ padding: '80px 0', background: 'white' }}>
      <div className="auto-container">
        <div className="sec-title text-center" style={{ marginBottom: '60px' }} data-aos="fade-up">
          <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#202124', marginBottom: '15px' }}>
            Your Safety & Satisfaction, Guaranteed
          </h2>
          <div className="text" style={{ fontSize: '18px', color: '#696969', maxWidth: '700px', margin: '0 auto' }}>
            We go the extra mile to ensure every booking is safe, secure, and satisfactory
          </div>
        </div>

        <div className="row">
          {guarantees.map((item, index) => (
            <div key={item.id} className="col-lg-4 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay={index * 50}>
              <div className="guarantee-card" style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px',
                padding: '30px',
                background: '#f8f9fc',
                borderRadius: '12px',
                marginBottom: '30px',
                transition: 'all 0.3s ease',
                border: '2px solid transparent'
              }}>
                <div className="icon-box" style={{
                  width: '70px',
                  height: '70px',
                  background: `${item.color}15`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.3s ease'
                }}>
                  <i className={`la ${item.icon}`} style={{ fontSize: '36px', color: item.color }}></i>
                </div>

                <div className="content">
                  <h4 style={{ fontSize: '20px', fontWeight: '600', color: '#202124', marginBottom: '10px' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#696969', margin: 0 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .guarantee-card:hover {
          background: white;
          border-color: #2aa389;
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
          transform: translateY(-5px);
        }

        .guarantee-card:hover .icon-box {
          transform: scale(1.1);
        }

        @media (max-width: 767px) {
          .guarantees-section {
            padding: 60px 0 !important;
          }

          .sec-title {
            margin-bottom: 40px !important;
          }

          .guarantee-card {
            padding: 25px !important;
            margin-bottom: 20px !important;
          }

          .icon-box {
            width: 60px !important;
            height: 60px !important;
          }

          .icon-box i {
            font-size: 30px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default GuaranteesSection;
