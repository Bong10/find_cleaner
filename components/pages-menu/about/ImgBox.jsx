"use client";

const ImgBox = () => {
  const imgContent = [
    {
      id: 1,
      block: [{ img: "about-img-1" }],
    },
    {
      id: 2,
      block: [{ img: "about-img-2" }, { img: "about-img-3" }],
    },
    {
      id: 3,
      block: [{ img: "about-img-4" }, { img: "about-img-5" }],
    },
    {
      id: 4,
      block: [{ img: "about-img-6" }],
    },
  ];

  return (
    <div className="about-hero-section" style={{ marginBottom: '60px' }}>
      {/* Main Hero Image */}
      <div className="row g-4">
        <div className="col-lg-6 col-md-12">
          <div 
            className="main-hero-image" 
            style={{ 
              position: 'relative', 
              height: '500px', 
              borderRadius: '12px', 
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, #2aa389 0%, #1e8c73 100%)'
            }}
            data-aos="fade-right"
          >
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: 'white',
              width: '100%',
              padding: '20px'
            }}>
              <i className="la la-broom" style={{ fontSize: '100px', opacity: 0.4, marginBottom: '20px' }}></i>
              <h3 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '10px' }}>Find Cleaner</h3>
              <p style={{ fontSize: '16px', opacity: 0.9 }}>Connecting Quality Cleaners with Trusted Clients</p>
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-12">
          <div className="row g-4">
            {/* Top Image */}
            <div className="col-12">
              <div 
                className="secondary-image" 
                style={{ 
                  position: 'relative', 
                  height: '240px', 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
                data-aos="fade-left"
                data-aos-delay="100"
              >
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: 'white',
                  width: '100%',
                  padding: '20px'
                }}>
                  <i className="la la-shield-alt" style={{ fontSize: '70px', opacity: 0.4 }}></i>
                  <p style={{ fontSize: '16px', opacity: 0.9, marginTop: '15px', fontWeight: '500' }}>Verified & Trusted</p>
                </div>
              </div>
            </div>

            {/* Bottom Two Images */}
            <div className="col-6">
              <div 
                className="small-image" 
                style={{ 
                  position: 'relative', 
                  height: '240px', 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                }}
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: 'white',
                  width: '100%',
                  padding: '20px'
                }}>
                  <i className="la la-calendar-check" style={{ fontSize: '60px', opacity: 0.4 }}></i>
                  <p style={{ fontSize: '14px', opacity: 0.9, marginTop: '10px', fontWeight: '500' }}>Easy Booking</p>
                </div>
              </div>
            </div>

            <div className="col-6">
              <div 
                className="small-image" 
                style={{ 
                  position: 'relative', 
                  height: '240px', 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                }}
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: 'white',
                  width: '100%',
                  padding: '20px'
                }}>
                  <i className="la la-lock" style={{ fontSize: '60px', opacity: 0.4 }}></i>
                  <p style={{ fontSize: '14px', opacity: 0.9, marginTop: '10px', fontWeight: '500' }}>Secure Platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .main-hero-image:hover,
        .secondary-image:hover,
        .small-image:hover {
          transform: translateY(-5px);
          transition: all 0.3s ease;
        }

        @media (max-width: 991px) {
          .main-hero-image {
            height: 400px !important;
          }
          .secondary-image,
          .small-image {
            height: 200px !important;
          }
        }

        @media (max-width: 575px) {
          .main-hero-image {
            height: 300px !important;
          }
          .secondary-image {
            height: 180px !important;
          }
          .small-image {
            height: 150px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ImgBox;
