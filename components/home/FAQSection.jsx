"use client";

import { useState } from "react";

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      id: 1,
      question: "How much does cleaning cost?",
      answer: "Prices start from £15/hour for regular home cleaning and vary based on service type, property size, and location. Deep cleaning starts from £25/hour, and end-of-tenancy cleaning packages start from £180. You'll see exact prices when you browse cleaners in your area."
    },
    {
      id: 2,
      question: "Are all cleaners background verified and insured?",
      answer: "Yes, absolutely. Every cleaner on Find Cleaner undergoes thorough background checks and identity verification. All professionals are fully insured, giving you complete peace of mind when booking services."
    },
    {
      id: 3,
      question: "Can I cancel or reschedule a booking?",
      answer: "Yes, you can cancel or reschedule up to 24 hours before your booking at no charge. Cancellations within 24 hours may incur a small fee. You can manage all your bookings through your dashboard or by contacting the cleaner directly."
    },
    {
      id: 4,
      question: "How do I become a cleaner on the platform?",
      answer: "Simply click 'Join as a Cleaner', create your profile, upload necessary documents (ID, insurance, certifications), and pass our verification process. Once approved, you can start receiving job requests immediately and set your own rates and schedule."
    },
    {
      id: 5,
      question: "What if I'm not satisfied with the cleaning service?",
      answer: "We offer a 100% satisfaction guarantee. If you're not happy with the service, contact us within 24 hours and we'll work with the cleaner to make it right. If the issue isn't resolved, we'll provide a full refund."
    },
    {
      id: 6,
      question: "How do payments work?",
      answer: "Payment is processed securely through our platform after the service is completed. We use bank-level encryption to protect your information. Cleaners receive payment within 2-3 business days after job completion."
    },
    {
      id: 7,
      question: "What areas do you cover?",
      answer: "We operate in over 200 cities across the UK, including London, Manchester, Birmingham, Leeds, Glasgow, and many more. Enter your postcode in the search bar to see available cleaners in your area."
    },
    {
      id: 8,
      question: "Do I need to provide cleaning supplies?",
      answer: "This varies by cleaner. Some bring their own supplies and equipment, while others prefer to use yours. You can check each cleaner's profile or discuss this when booking. It's usually mentioned in their service description."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section" style={{ padding: '80px 0', background: 'white' }}>
      <div className="auto-container">
        <div className="row">
          <div className="col-lg-5 col-md-12" data-aos="fade-right">
            <div className="faq-content" style={{ position: 'sticky', top: '100px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#202124', marginBottom: '20px' }}>
                Frequently Asked Questions
              </h2>
              <p style={{ fontSize: '17px', lineHeight: '1.8', color: '#696969', marginBottom: '30px' }}>
                Got questions? We've got answers. If you can't find what you're looking for, our support team is always here to help.
              </p>
              
              <div style={{ 
                background: 'linear-gradient(135deg, #2aa389 0%, #1e8c73 100%)',
                padding: '30px',
                borderRadius: '16px',
                marginTop: '40px'
              }}>
                <h4 style={{ color: 'white', fontSize: '20px', fontWeight: '600', marginBottom: '15px' }}>
                  Still have questions?
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', marginBottom: '20px' }}>
                  Our friendly support team is here 24/7 to help you with anything you need.
                </p>
                <a 
                  href="/contact" 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'white',
                    color: '#2aa389',
                    padding: '12px 25px',
                    borderRadius: '50px',
                    fontSize: '15px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  className="contact-cta-btn"
                >
                  <i className="la la-comments"></i>
                  Contact Support
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-7 col-md-12" data-aos="fade-left">
            <div className="faq-accordion">
              {faqs.map((faq, index) => (
                <div 
                  key={faq.id}
                  className="faq-item"
                  style={{
                    background: activeIndex === index ? '#f8f9fc' : 'white',
                    border: activeIndex === index ? '2px solid #2aa389' : '1px solid #e8ecec',
                    borderRadius: '12px',
                    marginBottom: '15px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    style={{
                      width: '100%',
                      padding: '20px 25px',
                      background: 'transparent',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ 
                      fontSize: '17px', 
                      fontWeight: '600', 
                      color: activeIndex === index ? '#2aa389' : '#202124',
                      paddingRight: '20px',
                      flex: 1
                    }}>
                      {faq.question}
                    </span>
                    <i 
                      className={`la ${activeIndex === index ? 'la-minus' : 'la-plus'}`}
                      style={{ 
                        fontSize: '20px', 
                        color: activeIndex === index ? '#2aa389' : '#696969',
                        transition: 'all 0.3s ease',
                        flexShrink: 0
                      }}
                    ></i>
                  </button>

                  <div 
                    style={{
                      maxHeight: activeIndex === index ? '500px' : '0',
                      overflow: 'hidden',
                      transition: 'max-height 0.3s ease'
                    }}
                  >
                    <div style={{ padding: '0 25px 20px 25px' }}>
                      <p style={{ 
                        fontSize: '15px', 
                        lineHeight: '1.8', 
                        color: '#696969',
                        margin: 0
                      }}>
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .faq-item:hover {
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }

        .contact-cta-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }

        @media (max-width: 991px) {
          .faq-section {
            padding: 60px 0 !important;
          }

          .faq-content {
            position: static !important;
            margin-bottom: 40px;
          }

          .faq-content h2 {
            font-size: 28px !important;
          }

          .faq-content p {
            font-size: 16px !important;
          }
        }

        @media (max-width: 767px) {
          .faq-section {
            padding: 50px 0 !important;
          }

          .faq-content h2 {
            font-size: 26px !important;
            margin-bottom: 15px !important;
          }

          .faq-content p {
            font-size: 15px !important;
            margin-bottom: 25px !important;
          }

          .faq-content > div {
            padding: 25px !important;
            margin-top: 30px !important;
          }

          .faq-content > div h4 {
            font-size: 18px !important;
          }

          .faq-content > div p {
            font-size: 14px !important;
          }

          .contact-cta-btn {
            padding: 10px 20px !important;
            font-size: 14px !important;
          }

          .faq-item button {
            padding: 16px 18px !important;
          }

          .faq-item button span {
            font-size: 15px !important;
          }

          .faq-item > div > div {
            padding: 0 18px 18px 18px !important;
          }

          .faq-item > div > div p {
            font-size: 14px !important;
          }
        }

        @media (max-width: 480px) {
          .faq-section {
            padding: 40px 0 !important;
          }

          .faq-content h2 {
            font-size: 24px !important;
          }

          .faq-item button {
            padding: 14px 16px !important;
          }

          .faq-item button span {
            font-size: 14px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default FAQSection;
