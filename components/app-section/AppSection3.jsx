import Image from "next/image";
import Link from "next/link";

const AppSection3 = () => {
  return (
    <section className="subscribe-section-two -type-3">
      <div
        className="background-image"
        style={{ backgroundImage: "url(/images/index-13/cta/bg.png)" }}
      ></div>
      <div className="auto-container" data-aos="fade-up">
        <div className="row align-items-center justify-content-between">
          <div className="col-lg-5">
            <div className="sec-title light mb-0">
              <h2 className="text-white">Get Started with Our Trusted Cleaning Services</h2>
              <div className="text text-white">
              Join thousands of satisfied users. Whether you need a one-time cleaning or regular upkeep, we’ve got you covered.
                <br /> credit card required.
              </div>

              <div className="row buttons">
                <div className="col-auto">
                <a
                  href="#"
                  className="theme-btn btn-style-three btn-white-10 call-modal"
                  data-bs-toggle="modal"
                  data-bs-target="#loginPopupModal"
                >
                  Explore Services
                </a>
                </div>
                <div className="col-auto">
                <Link
                href="/employers-dashboard/post-jobs"
                className="theme-btn btn-style-one btn-white"
                >
                  Join as a Cleaner
                </Link>
                </div>
              </div>
            </div>
          </div>
          {/* End .col */}

          <div className="col-lg-5">
            <div className="image">
              <Image
                width={519}
                height={429}
                src="/images/resource/image-3.png"
                alt="image"
              />
            </div>
          </div>
          {/* End .col */}
        </div>
        {/* End .row */}
      </div>
    </section>
  );
};

export default AppSection3;
