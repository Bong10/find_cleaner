"use client";
import Image from "next/image";
import Link from "next/link";

const RegBanner = () => {
  const regBannerContent = [
    {
      id: 1,
      name: "Employers: Need a sparkling space?",
      text: `Transform your workspace or home with our trusted professional cleaners. Quick, reliable, and thorough service guaranteed.`,
      avatar: "/images/resource/employ.png",
      bannerClass: "banner-style-one",
      primaryButton: {
        text: "Find Cleaners",
        href: "/find-cleaners",
        className: "btn btn-primary"
      },
      secondaryButton: {
        text: "Post a Job",
        href: "/post-job",
        className: "btn btn-secondary"
      },
      width: "221",
      height: "281",
    },
    {
      id: 2,
      name: "Cleaners: Join TidyLinker Gurus Network",
      text: `Connect with quality clients, set your own rates, and grow your cleaning business with our platform.`,
      avatar: "/images/resource/candidate.png",
      bannerClass: "banner-style-two dark",
      primaryButton: {
        text: "Browse Employer Jobs",
        href: "/browse-jobs",
        className: "btn btn-primary bt-green"
      },
      secondaryButton: {
        text: "Sign Up Today",
        href: "/register",
        className: "btn btn-secondary"
      },
      width: "207",
      height: "283",
    },
  ];
  
  return (
    <>
      {regBannerContent.map((item) => (
        <div
          className={`${item.bannerClass} -type-2 col-lg-6 col-md-12 col-sm-12`}
          key={item.id}
        >
          <div className="inner-box">
            <div className="content">
              <h3>{item.name}</h3>
              <p>{item.text}</p>
              <div className="cta-buttons">
                <Link href={item.primaryButton.href} className={item.primaryButton.className} style={{backgroundColor: item.primaryButton.className.includes('bt-green') ? '#4B9B97' : '', borderColor: item.primaryButton.className.includes('bt-green') ? '#4B9B97' : '',}}>
                  {item.primaryButton.text}
                </Link>
                <Link href={item.secondaryButton.href} className={item.secondaryButton.className} 
                style={{backgroundColor: 'transparent',color: '#0a0e16', border: '1px solid #E5E7EB'}}>
                  {item.secondaryButton.text}
                </Link>
              </div>
            </div>
            <figure className="image">
              <Image
                width={item.width}
                height={item.height}
                src={item.avatar}
                alt="resource"
              />
            </figure>
          </div>
        </div>
      ))}

      <style jsx>{`
        .banner-style-one .inner-box,
        .banner-style-two .inner-box {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 40px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .banner-style-one .content h3, 
        .banner-style-two .content h3 {
          color: #111827;
          font-size: 1.125rem;
          margin-bottom: 0.5rem;
        }

        .banner-style-two .content, 
        .banner-style-one .content {
            padding-right: 0px !important;
        }
        
        .banner-style-one .content p, 
        .banner-style-two .content p {
          color: #6B7280;
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: 1.25rem;
        }
        
        .cta-buttons {
          display: flex;
          gap: 12px;
        }
        
        .btn-primary {
          background: #4A90E2;
          color: white;
        }
        
        .btn-primary:hover {
          background: #357ABD;
        }
        
        .btn-green {
          background-color: #52C41A !important;
          color: white;
        }
        
        .btn-green:hover {
          background: #3FA618;
        }
        
        a.btn.btn-secondary{
          background: transparent !important;
          color: #0a0e16 !important;
          border: 1px solid #E5E7EB !important;
        }
        
        .btn-secondary:hover {
          background: #4B5563 !important;
        }
        
        .banner-style-one .image,
        .banner-style-two .image {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          background: #f3f4f6;
          flex-shrink: 0;
          margin: 0;
          position: relative;
          left: 0;
          right: 0;
        }
        
        .banner-style-one .image img,
        .banner-style-two .image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        @media (max-width: 768px) {
          .banner-style-one .inner-box,
          .banner-style-two .inner-box {
            // flex-direction: column;
            // text-align: center;
          }
          
          .cta-buttons {
            // justify-content: center;
            // flex-direction: column;
            // width: 100%;
          }
          
          .btn {
            // width: 100%;
          }
          
          .banner-style-one .image,
          .banner-style-two .image {
            margin-bottom: 20px;
            left: 0;
            right: 0;
          }

          .banner-style-two .content, 
          .banner-style-one .content {
              padding-right: 50px !important;
          }
        }

        @media only screen and (max-width: 599px) {
            .banner-style-two .content, .banner-style-one .content {
                padding: 0;
                text-align: left !important;
            }
      }
      `}</style>
    </>
  );
};

export default RegBanner;