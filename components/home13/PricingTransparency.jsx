"use client";

const PricingTransparency = () => {
  const pricingExamples = [
    {
      id: 1,
      service: "Regular Home Cleaning",
      description: "Standard cleaning for homes & flats",
      startingPrice: "£15",
      unit: "per hour",
      features: ["Dusting & vacuuming", "Kitchen cleaning", "Bathroom sanitizing", "Flexible scheduling"],
      popular: false
    },
    {
      id: 2,
      service: "Deep Cleaning",
      description: "Thorough cleaning for entire property",
      startingPrice: "£25",
      unit: "per hour",
      features: ["All surfaces cleaned", "Inside appliances", "Hard-to-reach areas", "Move-in ready"],
      popular: true
    },
    {
      id: 3,
      service: "End of Tenancy",
      description: "Complete cleaning for property handover",
      startingPrice: "£180",
      unit: "from",
      features: ["Professionally certified", "Carpet cleaning included", "Guaranteed deposit return", "2-5 day turnaround"],
      popular: false
    }
  ];

  return (
    <section className="pricing-transparency-section" style={{ 
      padding: '80px 0', 
      background: 'linear-gradient(135deg, #f8f9fc 0%, #e8f5f3 100%)' 
    }}>
      <div className="auto-container">
        <div className="sec-title text-center" style={{ marginBottom: '60px' }} data-aos="fade-up">
          <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#202124', marginBottom: '15px' }}>
            Transparent Pricing, No Hidden Fees
          </h2>
          <div className="text" style={{ fontSize: '18px', color: '#696969', maxWidth: '700px', margin: '0 auto' }}>
            See what you'll pay before you book. Prices vary by location and cleaner experience.
          </div>
        </div>

        <div className="row">
          {pricingExamples.map((item, index) => (
            <div key={item.id} className="col-lg-4 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="pricing-card" style={{
                background: 'white',
                borderRadius: '16px',
                padding: '40px 30px',
                marginBottom: '30px',
                position: 'relative',
                border: item.popular ? '3px solid #2aa389' : '1px solid #e8ecec',
                boxShadow: item.popular ? '0 10px 40px rgba(42, 163, 137, 0.2)' : '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {item.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #2aa389 0%, #1e8c73 100%)',
                    color: 'white',
                    padding: '6px 20px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600',
                    boxShadow: '0 4px 15px rgba(42, 163, 137, 0.3)'
                  }}>
                    MOST POPULAR
                  </div>
                )}

                <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#202124', marginBottom: '8px' }}>
                    {item.service}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#696969', marginBottom: '20px' }}>
                    {item.description}
                  </p>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <span style={{ fontSize: '48px', fontWeight: '700', color: '#2aa389', lineHeight: 1 }}>
                      {item.startingPrice}
                    </span>
                    <span style={{ fontSize: '16px', color: '#696969', display: 'block', marginTop: '8px' }}>
                      {item.unit}
                    </span>
                  </div>
                </div>

                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: '0 0 30px 0',
                  flex: 1
                }}>
                  {item.features.map((feature, idx) => (
                    <li key={idx} style={{ 
                      fontSize: '15px', 
                      color: '#1c1d1f', 
                      marginBottom: '12px',
                      paddingLeft: '30px',
                      position: 'relative'
                    }}>
                      <i className="la la-check-circle" style={{ 
                        position: 'absolute', 
                        left: 0, 
                        fontSize: '20px', 
                        color: '#2aa389' 
                      }}></i>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a 
                  href="/cleaners" 
                  className="pricing-cta-btn"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    background: item.popular ? 'linear-gradient(135deg, #2aa389 0%, #1e8c73 100%)' : '#f8f9fc',
                    color: item.popular ? 'white' : '#2aa389',
                    padding: '14px 30px',
                    borderRadius: '50px',
                    fontSize: '16px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    border: item.popular ? 'none' : '2px solid #2aa389'
                  }}
                >
                  Find Cleaners
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center" style={{ marginTop: '40px' }} data-aos="fade-up">
          <p style={{ fontSize: '16px', color: '#696969', marginBottom: '15px' }}>
            <i className="la la-info-circle" style={{ color: '#2aa389', fontSize: '20px', marginRight: '8px' }}></i>
            Final prices may vary based on property size, location, and specific requirements
          </p>
          <p style={{ fontSize: '15px', color: '#696969', fontWeight: '600' }}>
            ✓ No booking fees  ✓ No hidden charges  ✓ Pay only for what you book
          </p>
        </div>
      </div>

      <style jsx global>{`
        .pricing-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 45px rgba(0,0,0,0.12) !important;
        }

        .pricing-cta-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(42, 163, 137, 0.3);
        }

        @media (max-width: 767px) {
          .pricing-transparency-section {
            padding: 60px 0 !important;
          }

          .pricing-card {
            padding: 30px 25px !important;
          }

          .pricing-card h3 {
            font-size: 22px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default PricingTransparency;
