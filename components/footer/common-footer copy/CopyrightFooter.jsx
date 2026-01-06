import Social from "./Social";

const CopyrightFooter = () => {
  return (
    <div className="footer-bottom">
      <div className="auto-container">
        <div className="outer-box">
          <div className="copyright-text">
            © {new Date().getFullYear()} Find Cleaner by{" "}
            <a
              href="https://digitalwebsolutions.co.uk"
              target="_blank"
              rel="noopener noreferrer"
            >
              Digital Web Solutions
            </a>
            . All Right Reserved.
          </div>
          <div className="social-links">
            <Social />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyrightFooter;
