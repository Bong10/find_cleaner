import dynamic from "next/dynamic";
import DashboadHome from "@/components/dashboard-pages/employers-dashboard/dashboard";
import DashboardGuard from "@/components/auth/DashboardGuard";

export const metadata = {
  title: "Employer Dashboard || Find Cleaner - Cleaning Job Management Portal",
description: "Manage your cleaning job listings, track applications, and communicate with cleaners directly from your Find Cleaner employer dashboard."
};

const index = () => {
  return (
    <DashboardGuard>
      <DashboadHome />
    </DashboardGuard>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
