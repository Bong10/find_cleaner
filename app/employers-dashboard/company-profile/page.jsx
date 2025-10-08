import dynamic from "next/dynamic";
import CompanyProfile from "@/components/dashboard-pages/employers-dashboard/company-profile";

export const metadata = {
 title: "Company Profile || TidyLinker - Employer Information & Job Listings",
description: "Explore company profiles on TidyLinker. View employer details, active cleaning job listings, and connect with trusted businesses hiring cleaners."
};

const index = () => {
  return (
    <>
      <CompanyProfile />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
