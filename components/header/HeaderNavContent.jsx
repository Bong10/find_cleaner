"use client";

import Link from "next/link";
import {
  blogItems,
  candidateItems,
  employerItems,
  findJobItems,
  homeItems,
  pageItems,
  shopItems,
} from "../../data/mainMenuData";
import {
  isActiveParent,
  isActiveLink,
  isActiveParentChaild,
} from "../../utils/linkActiveChecker";
import { usePathname } from "next/navigation";

const HeaderNavContent = () => {
  return (
    <>
      <nav className="nav main-menu">
        <ul className="navigation" id="navbar">
          {/* Home */}
          <li>
            <Link href="/">Home</Link>
          </li>

          {/* Find Cleaners */}
          <li>
            <Link href="/cleaners">Find Cleaners</Link>
          </li>

          {/* Browse Jobs */}
          <li>
            <Link href="/jobs">Browse Jobs</Link>
          </li>

          {/* Pricing & Plans */}
          {/* <li>
            <Link href="/pricing">Pricing & Plans</Link>
          </li> */}

          {/* How it Works */}
          {/* <li>
            <Link href="/home-12">How It Works</Link>
          </li> */}

          {/* Blog */}
          {/* <li>
            <Link href="/blog-list-v1">Blog</Link>
          </li> */}
        </ul>
      </nav>
    </>
  );
};

export default HeaderNavContent;
