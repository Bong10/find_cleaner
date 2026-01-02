import Image from "next/image";
import Link from "next/link";

const About9 = () => {

  const featureList = [
    {
      id: 1,
      icon: "flaticon-shield",
      title: "Trusted Professionals",
      text: `Work with background-verified cleaners you can trust.`,
    },
    {
      id: 2,
      icon: "flaticon-money",
      title: "Secure Payments",
      text: `Pay securely only after the job is completed to your satisfaction.`,
    },
    {
      id: 3,
      icon: "flaticon-checked",
      title: "Satisfaction Guaranteed",
      text: `If you're not happy, we'll make it right or help you find another professional.`,
    },
    {
      id: 4,
      icon: "flaticon-chat",
      title: "AI-Powered Chat Assistant",
      text: `Get instant help finding the perfect cleaner with our intelligent chatbot available 24/7.`,
    },
  ];

  return (
    <>
      {/* <!-- About Section --> */}
      <section className="about-section-two style-two layout-pt-60 layout-pb-60">
        <div className="auto-container">
          <div className="row justify-content-between align-items-center">
            {/* <!-- Image Column --> */}
            <div className="image-column -no-margin col-xl-6 col-lg-6 col-md-12 col-sm-12 wow fadeInRight">
              <div className="image-box -type-1">
                <figure
                  className="main-image"
                  data-aos-delay="500"
                  data-aos="fade-in"
                >
                  <Image
                    width={570}
                    height={558}
                    src="/images/index-13/images/1.jpg"
                    alt="resource"
                  />
                </figure>

                {/* <!-- Info BLock One --> */}
                <div
                  className="info_block"
                  data-aos-delay="800"
                  data-aos="fade-in"
                >
                  <span className="icon flaticon-shield"></span>
                  <p>
                   Trusted Cleaner <br />
                  
                  </p>
                </div>

                {/* <!-- Info BLock Two --> */}
                <div
                  className="info_block_two"
                  data-aos-delay="1100"
                  data-aos="fade-in"
                >
                  <p>4.9 ★ Happy clients.</p>
                  <div style={{ display: "inline-block", color: "green" }}><span className="flaticon-star" ></span>
                  <span className="flaticon-star"></span>
                  <span className="icon flaticon-star"></span>
                  <span className="icon flaticon-star" style={{ clipPath: "inset(0 50% 0 0)" }}></span></div>
                  {/* <div className="image">
                    <Image
                      width={206}
                      height={53}
                      src="/images/resource/multi-peoples.png"
                      alt="resource"
                    />
                  </div> */}
                </div>

                {/* <!-- Info BLock Four --> */}
                <div
                  className="info_block_four"
                  data-aos-delay="1300"
                  data-aos="fade-in"
                >
                  <span className="icon flaticon-file"></span>
                  <div className="inner">
                    <p>Upload Your CV</p>
                    <span className="sub-text">
                      It only takes a few seconds
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* End img-column */}

            {/* <!-- Content Column --> */}


           


         <div className="content-column mb-0 col-xl-5 col-lg-6 col-md-12 col-sm-12">
            <div data-aos="fade-right">
            <div className="sec-title">
              <span className="sub-title text-green">Join Thousands of Happy Clients</span>
              <h2>Why Choose Our Platform?</h2>
            </div>

            <div className="content-icons">
              {featureList.map((item) => (
                <div className="item" key={item.id}>
                  <div className="icon-wrap">
                    <span className={`icon-green icon ${item.icon}`}></span>
                  </div>
                  <div className="content">
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
                  href="/candidates-dashboard/cv-manager"
                  className="theme-btn btn-style-one"
                >
                  Get Started
                </Link>
            
          </div>
          </div>
        </div>
      </div>
      </section>
      {/* <!-- End About Section -->  */}
    </>
  );
};

export default About9;
