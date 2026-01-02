"use client";

import Image from "next/image";
import Link from "next/link";
import Social from "./Social";
import FooterNavContent from "./FooterNavContent";

const CopyrightFooter = () => {
  return (
    <div className="footer-bottom">
      <div className="auto-container">
        <div className="outer-box">
          {/* Brand logo */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo" aria-label="CG Cambridge Group Home">
              <Image
                src="/images/dws.png"
                alt="Digital Web Solutions Logo"
                width={154}
                height={54}
                priority
              />
              {/* <span className="footer-group">Digital Web Solutions</span> */}
            </Link>
          </div>

          {/* Footer navigation - imported component */}
          <div className="footer-nav-wrapper">
            <FooterNavContent />
          </div>

          {/* Social links */}
          <div className="social-links">
            <Social />
          </div>
        </div>
      </div>

      <style jsx>{`
        .outer-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          flex-wrap: wrap;
          gap: 30px;
        }

        .footer-brand {
          flex: 0 0 auto;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .footer-group {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }

        .footer-nav-wrapper {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .footer-nav-wrapper :global(.navigation) {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          gap: 30px;
          align-items: center;
        }

        .footer-nav-wrapper :global(.navigation li a) {
          color: #6b7280;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .footer-nav-wrapper :global(.navigation li a:hover) {
          color: #111827;
        }

        .social-links {
          flex: 0 0 auto;
        }

        @media (max-width: 768px) {
          .outer-box {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .footer-nav-wrapper {
            width: 100%;
          }

          .footer-nav-wrapper :global(.navigation) {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default CopyrightFooter;