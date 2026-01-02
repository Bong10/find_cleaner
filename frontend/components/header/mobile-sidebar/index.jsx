"use client";

import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import mobileMenuData from "../../../data/mobileMenuData"; // Assuming this contains the flat menu data
import SidebarFooter from "./SidebarFooter";
import SidebarHeader from "./SidebarHeader";
import { isActiveLink } from "../../../utils/linkActiveChecker";
import { usePathname, useRouter } from "next/navigation";

const Index = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      className="offcanvas offcanvas-start mobile_menu-contnet"
      tabIndex="-1"
      id="offcanvasMenu"
      data-bs-scroll="true"
    >
      <SidebarHeader />
      {/* End Sidebar Header */}

      <Sidebar>
        <Menu>
          {mobileMenuData.map((item) => (
            <MenuItem
              key={item.id}
              onClick={() => router.push(item.routePath)}
              className={isActiveLink(item.routePath, pathname) ? "menu-active-link" : ""}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Sidebar>

      <SidebarFooter />
    </div>
  );
};

export default Index;
