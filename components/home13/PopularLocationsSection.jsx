"use client";

import Link from "next/link";

const PopularLocationsSection = () => {
  const popularCities = [
    { name: "London", jobs: "2,500+", cleaners: "1,200+" },
    { name: "Manchester", jobs: "850+", cleaners: "450+" },
    { name: "Birmingham", jobs: "720+", cleaners: "380+" },
    { name: "Leeds", jobs: "540+", cleaners: "290+" },
    { name: "Glasgow", jobs: "480+", cleaners: "260+" },
    { name: "Liverpool", jobs: "420+", cleaners: "220+" },
    { name: "Bristol", jobs: "380+", cleaners: "200+" },
    { name: "Edinburgh", jobs: "360+", cleaners: "190+" },
    { name: "Sheffield", jobs: "320+", cleaners: "170+" },
    { name: "Newcastle", jobs: "290+", cleaners: "150+" },
    { name: "Cardiff", jobs: "270+", cleaners: "140+" },
    { name: "Leicester", jobs: "250+", cleaners: "130+" }
  ];

  const popularServices = [
    "House Cleaning",
    "End of Tenancy Cleaning",
    "Deep Cleaning",
    "Office Cleaning",
    "Carpet Cleaning",
    "After Builders Cleaning",
    "Window Cleaning",
    "Oven Cleaning"
  ];

  return (
    <section className="popular-locations-section" style={{ 
      padding: '80px 0', 
      background: '#f8f9fc' 
    }}>
      <div className="auto-container">
        {/* Popular Cities */}
        <div className="cities-section" style={{ marginBottom: '60px' }}>
          <div className="sec-title text-center" style={{ marginBottom: '50px' }} data-aos="fade-up">
            <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#202124', marginBottom: '15px' }}>
              Find Cleaners Near You
            </h2>
            <div className="text" style={{ fontSize: '18px', color: '#696969' }}>
              Professional cleaning services available in major cities across the UK
            </div>
          </div>

          <div className="row">
            {popularCities.map((city, index) => (
              <div key={index} className="col-lg-3 col-md-4 col-sm-6" data-aos="fade-up" data-aos-delay={index * 30}>
                <Link 
                  href={`/cleaners?location=${city.name}`}
                  style={{
                    display: 'block',
                    background: 'white',
                    padding: '25px 20px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    textDecoration: 'none',
                    border: '1px solid #e8ecec',
                    transition: 'all 0.3s ease'
                  }}
                  className="city-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <i className="la la-map-marker" style={{ 
                      fontSize: '28px', 
                      color: '#2aa389',
                      marginRight: '12px'
                    }}></i>
                    <h4 style={{ 
                      fontSize: '19px', 
                      fontWeight: '600', 
                      color: '#202124',
                      margin: 0
                    }}>
                      {city.name}
                    </h4>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#696969' }}>
                    <span>
                      <i className="la la-briefcase" style={{ color: '#2aa389', marginRight: '5px' }}></i>
                      {city.jobs} jobs
                    </span>
                    <span>
                      <i className="la la-users" style={{ color: '#2aa389', marginRight: '5px' }}></i>
                      {city.cleaners} cleaners
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: '40px' }} data-aos="fade-up">
            <Link 
              href="/cleaners"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #2aa389 0%, #1e8c73 100%)',
                color: 'white',
                padding: '14px 35px',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
              className="view-all-btn"
            >
              View All Cities
              <i className="la la-arrow-right"></i>
            </Link>
          </div>
        </div>

        {/* Popular Services */}
        <div className="services-section">
          <div className="sec-title text-center" style={{ marginBottom: '40px' }} data-aos="fade-up">
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#202124', marginBottom: '15px' }}>
              Popular Cleaning Services
            </h3>
            <div className="text" style={{ fontSize: '16px', color: '#696969' }}>
              Browse our most requested cleaning services
            </div>
          </div>

          <div className="row justify-content-center" data-aos="fade-up">
            <div className="col-lg-10">
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '12px',
                justifyContent: 'center'
              }}>
                {popularServices.map((service, index) => (
                  <Link
                    key={index}
                    href={`/cleaners?service=${encodeURIComponent(service)}`}
                    style={{
                      display: 'inline-block',
                      background: 'white',
                      color: '#2aa389',
                      padding: '12px 24px',
                      borderRadius: '50px',
                      fontSize: '15px',
                      fontWeight: '500',
                      textDecoration: 'none',
                      border: '2px solid #2aa389',
                      transition: 'all 0.3s ease'
                    }}
                    className="service-tag"
                  >
                    {service}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .city-card:hover {
          border-color: #2aa389;
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          transform: translateY(-5px);
        }

        .city-card:hover h4 {
          color: #2aa389;
        }

        .view-all-btn:hover,
        .service-tag:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(42, 163, 137, 0.3);
        }

        .service-tag:hover {
          background: linear-gradient(135deg, #2aa389 0%, #1e8c73 100%);
          color: white;
        }

        @media (max-width: 767px) {
          .popular-locations-section {
            padding: 60px 0 !important;
          }

          .city-card {
            padding: 20px 18px !important;
          }

          .service-tag {
            padding: 10px 20px !important;
            font-size: 14px !important;
          }

          .cities-section {
            margin-bottom: 50px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default PopularLocationsSection;
