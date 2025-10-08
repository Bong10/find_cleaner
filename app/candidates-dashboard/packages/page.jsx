import dynamic from "next/dynamic";
import Packages from "@/components/dashboard-pages/candidates-dashboard/packages";

export const metadata = {
  title: "Packages || TidyLinker - Pricing Plans & Membership Options",
description: "View TidyLinker’s subscription packages. Affordable plans for hiring cleaners or finding verified cleaning jobs with premium visibility and tools."
};

const index = () => {
  return (
    <>
      <Packages />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
