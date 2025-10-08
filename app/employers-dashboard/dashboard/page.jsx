import dynamic from "next/dynamic";
import DashboadHome from "@/components/dashboard-pages/employers-dashboard/dashboard";

export const metadata = {
  title: "Employer Dashboard || TidyLinker - Cleaning Job Management Portal",
description: "Manage your cleaning job listings, track applications, and communicate with cleaners directly from your TidyLinker employer dashboard."
};

const index = () => {
  return (
    <>
      <DashboadHome />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
