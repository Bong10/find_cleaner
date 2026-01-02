import dynamic from "next/dynamic";
import Packages from "@/components/dashboard-pages/employers-dashboard/packages";

export const metadata = {
  title: "Packages || Find Cleaner - Pricing Plans for Cleaners & Employers",
description: "Explore Find Cleaner’s affordable packages. Choose the right plan to hire trusted cleaners, post cleaning jobs, or boost your visibility on the platform."
};

const index = () => {
  return (
    <>
      <Packages />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
