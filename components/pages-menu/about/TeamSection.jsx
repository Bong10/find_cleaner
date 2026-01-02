"use client";

import Image from "next/image";

const TeamSection = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "Founder & CEO",
      image: "/images/resource/team-1.jpg",
      bio: "Passionate about connecting people and creating opportunities in the cleaning industry.",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "Chief Technology Officer",
      image: "/images/resource/team-2.jpg",
      bio: "Building innovative solutions to make finding cleaning services seamless and secure.",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      position: "Head of Community",
      image: "/images/resource/team-3.jpg",
      bio: "Dedicated to supporting our cleaners and ensuring exceptional client experiences.",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      id: 4,
      name: "David Thompson",
      position: "Operations Manager",
      image: "/images/resource/team-4.jpg",
      bio: "Ensuring smooth operations and quality standards across all platform activities.",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    }
  ];

  return (
    <section className="team-section" style={{ padding: '100px 0', background: 'white' }}>
      <div className="auto-container">
        <div className="sec-title text-center">
          <h2>Meet Our Team</h2>
          <div className="text">
            Dedicated professionals committed to revolutionizing the cleaning services industry
          </div>
        </div>

        <div className="row" style={{ marginTop: '50px' }}>
          {teamMembers.map((member) => (
            <div 
              className="col-lg-3 col-md-6 col-sm-12" 
              key={member.id}
              data-aos="fade-up"
              data-aos-delay={member.id * 100}
            >
              <div 
                className="team-member"
                style={{
                  textAlign: 'center',
                  marginBottom: '30px',
                  transition: 'all 0.3s ease'
                }}
              >
                <div 
                  className="image-box"
                  style={{
                    position: 'relative',
                    marginBottom: '20px',
                    overflow: 'hidden',
                    borderRadius: '8px'
                  }}
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={300}
                    height={300}
                    style={{
                      width: '100%',
                      height: 'auto',
                      transition: 'transform 0.3s ease'
                    }}
                    onError={(e) => {
                      e.target.src = '/images/resource/candidate-1.png';
                    }}
                  />
                  <div 
                    className="social-links"
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      background: 'rgba(25, 103, 210, 0.9)',
                      padding: '10px',
                      transform: 'translateY(100%)',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <a href={member.social.linkedin} style={{ color: 'white', margin: '0 10px', fontSize: '18px' }}>
                      <i className="la la-linkedin"></i>
                    </a>
                    <a href={member.social.twitter} style={{ color: 'white', margin: '0 10px', fontSize: '18px' }}>
                      <i className="la la-twitter"></i>
                    </a>
                  </div>
                </div>
                <h4 style={{ 
                  fontSize: '20px', 
                  fontWeight: '600',
                  marginBottom: '5px',
                  color: '#202124'
                }}>
                  {member.name}
                </h4>
                <p style={{ 
                  fontSize: '14px',
                  color: '#1967d2',
                  fontWeight: '500',
                  marginBottom: '10px'
                }}>
                  {member.position}
                </p>
                <p style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.6',
                  color: '#696969',
                  padding: '0 10px'
                }}>
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .team-member:hover .image-box img {
          transform: scale(1.05);
        }
        
        .team-member:hover .social-links {
          transform: translateY(0) !important;
        }
      `}</style>
    </section>
  );
};

export default TeamSection;
