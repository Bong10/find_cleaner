import Image from "next/image";
import Link from "next/link";
import Social from "./Social";

const CopyrightFooter = () => {
  return (
    <div className="footer-bottom">
      <div className="auto-container">
        <div className="outer-box">
          {/* Replaced copyright with brand logo */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo" aria-label="CG Cambridge Group Home">
              <Image
                src="/images/cgcambridgegroup.png"
                alt="CG Cambridge Group"
                width={54}
                height={54}
                priority
              />
              <span className="footer-group">CG Cambridge Group</span>
            </Link>
          </div>

          {/* Social links unchanged */}
          <div className="social-links">
            <Social />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyrightFooter;
