import Link from "next/link";

const CallToAction2 = () => {
  return (
    <section
      className="call-to-action-two"
      style={{ backgroundImage: "url(/images/background/1.jpg)" }}
    >
      <div className="auto-container" data-aos="fade-up">
        <div className="sec-title light text-center">
          <h2>Your Next Cleaning Job Starts Here</h2>
          <div className="text">
            Discover verified clients, secure bookings, and build your cleaning career with confidence.
          </div>
        </div>

        <div className="btn-box">
          <Link href="/jobs" className="theme-btn btn-style-three">
            Search Jobs
          </Link>
          <Link href="/register" className="theme-btn btn-style-two">
            Apply Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction2;
