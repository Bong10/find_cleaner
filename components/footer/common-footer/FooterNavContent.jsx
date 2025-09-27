"use client";

import Link from "next/link";

const FooterNavContent = () => {
  return (
    <>
      <nav className="nav footer-menu">
        <ul className="navigation">
          <li>
            <Link href="/about">About Us</Link>
          </li>
          <li>
            <Link href="/help-center">Help Center</Link>
          </li>
          <li>
            <Link href="/terms">Terms of Use</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default FooterNavContent;