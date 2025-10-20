"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const HeaderNavContent = () => {
  const pathname = usePathname();

  const menuItems = [
    { id: 1, name: "Home", path: "/" },
    { id: 2, name: "Find Cleaners", path: "/cleaners" },
    { id: 3, name: "Browse Jobs", path: "/jobs" },
    // { id: 4, name: "Pricing & Plans", path: "/pricing" },
    // { id: 5, name: "How It Works", path: "/home-12" },
    // { id: 6, name: "Blog", path: "/blog-list-v1" },
  ];

  return (
    <>
      <nav className="nav main-menu">
        <ul className="navigation" id="navbar">
          {menuItems.map((item) => {
            const path = item.path;
            // Robust active logic: Home only on exact '/', others exact or prefix match
            const isActive = path === "/"
              ? pathname === "/"
              : pathname === path || pathname.startsWith(path + "/");

            return (
              <li
                key={item.id}
                className={isActive ? "active current" : ""}
                data-active={isActive ? "true" : "false"}
              >
                <Link
                  href={item.path}
                  aria-current={isActive ? "page" : undefined}
                  className={isActive ? "active-link menu-active-link" : undefined}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <style jsx>{`
        .main-menu {
          display: flex;
          justify-content: center; /* center the UL inside nav */
          width: 100%;
        }
        .navigation {
          display: flex;
          gap: 28px;
          align-items: center;
          justify-content: center; /* center items within UL */
          padding: 0; /* remove default UL indentation */
          margin: 0;  /* remove default UL margin */
        }
        .navigation li {
          list-style: none;
        }
        .navigation li a {
          position: relative;
          color: #374151;
          text-decoration: none;
          font-weight: 500;
          padding: 8px 2px;
          transition: color .2s ease;
        }
        .navigation li a:hover { color: #111827; }
  /* Override global theme spacing that pushes menu off-center */
  :global(.main-menu .navigation > li) { margin-right: 0 !important; padding: 0 10px; }
  :global(.main-menu .navigation > li:last-child) { margin-right: 0 !important; }
        /* Active by class, aria-current, data-active or explicit class */
        .navigation li.active a,
        .navigation li a.active-link,
        .navigation li a[aria-current="page"],
        .navigation li[data-active="true"] a {
          color: #1967d2;
          font-weight: 600;
        }
        .navigation li.active a::after,
        .navigation li a.active-link::after,
        .navigation li a[aria-current="page"]::after,
        .navigation li[data-active="true"] a::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -6px;
          height: 2px;
          background: #1967d2;
          border-radius: 2px;
        }
        @media (max-width: 768px) {
          .navigation { gap: 16px; }
        }
      `}</style>
    </>
  );
};

export default HeaderNavContent;