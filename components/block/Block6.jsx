"use client";

const Block6 = () => {
  const blockContent = [
    {
      id: 1,
      icon: "la la-edit",
      title: "Post Your Cleaning Task",
      text: "Tell us what you need cleaned and when. Specify your requirements, preferred date, and any special instructions.",
      details: ["Describe the job", "Set your schedule", "Add special requests"],
      color: "#1967d2",
    },
    {
      id: 2,
      icon: "la la-users",
      title: "Review & Select Cleaners",
      text: "Browse verified professionals in your area. Compare profiles, read reviews, check ratings, and view pricing.",
      details: ["View profiles & ratings", "Compare prices", "Check availability"],
      color: "#2aa389",
    },
    {
      id: 3,
      icon: "la la-check-circle",
      title: "Book & Track Progress",
      text: "Confirm your booking with secure payment. Track your cleaner's arrival, communicate directly, and rate the service.",
      details: ["Secure payment", "Real-time updates", "Rate & review"],
      color: "#ea4335",
    },
  ];
  
  return (
    <>
      {blockContent.map((item) => (
        <div className="col-lg-4 col-md-6 col-sm-12" key={item.id} data-aos="fade-up" data-aos-delay={item.id * 100}>
          <div className="work-block-enhanced">
            <div className="step-badge" style={{
              display: "inline-block",
              background: item.color,
              color: "#fff",
              padding: "8px 20px",
              borderRadius: "25px",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "25px"
            }}>
              Step {item.id}
            </div>

            <div className="icon-box" style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              background: `${item.color}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "25px",
              transition: "all 0.3s ease"
            }}>
              <i className={item.icon} style={{
                fontSize: "42px",
                color: item.color
              }}></i>
            </div>

            <h4 style={{
              fontSize: "22px",
              fontWeight: "700",
              marginBottom: "15px",
              color: "#202124"
            }}>
              {item.title}
            </h4>

            <p style={{
              fontSize: "15px",
              lineHeight: "1.8",
              color: "#696969",
              marginBottom: "20px"
            }}>
              {item.text}
            </p>

            <ul className="feature-list" style={{
              listStyle: "none",
              padding: 0,
              margin: 0
            }}>
              {item.details.map((detail, index) => (
                <li key={index} style={{
                  fontSize: "14px",
                  color: "#5f6368",
                  marginBottom: "10px",
                  paddingLeft: "25px",
                  position: "relative"
                }}>
                  <i className="la la-check" style={{
                    position: "absolute",
                    left: 0,
                    color: item.color,
                    fontSize: "16px",
                    fontWeight: "700"
                  }}></i>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      <style jsx>{`
        .work-block-enhanced {
          padding: 35px;
          background: #fff;
          border-radius: 12px;
          height: 100%;
          transition: all 0.3s ease;
          border: 1px solid #e8eaed;
        }

        .work-block-enhanced:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          transform: translateY(-5px);
          border-color: transparent;
        }

        .work-block-enhanced:hover .icon-box {
          transform: scale(1.08);
        }

        @media (max-width: 767px) {
          .work-block-enhanced {
            padding: 25px;
            margin-bottom: 25px;
          }

          .icon-box {
            width: 70px !important;
            height: 70px !important;
          }

          .icon-box i {
            font-size: 36px !important;
          }

          h4 {
            font-size: 20px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Block6;
