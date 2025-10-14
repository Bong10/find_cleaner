"use client";

import Link from "next/link";
import { isActiveLink } from "../../utils/linkActiveChecker";
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
            const isActive = isActiveLink(item.path, pathname);
            
            return (
              <li key={item.id} className={isActive ? "active" : ""}>
                <Link href={item.path}>{item.name}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default HeaderNavContent;