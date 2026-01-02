import dynamic from "next/dynamic";
import DashboadHome from "@/components/dashboard-pages/candidates-dashboard/dashboard";
import DashboardGuard from "@/components/auth/DashboardGuard";

export const metadata = {
 title: "Cleaner Dashboard || Find Cleaner - Your Cleaning Jobs Hub",
description: "Manage your cleaning jobs, profile, and applications all in one place. Find Cleaner helps cleaners stay organized and connected with trusted employers."
};

const index = () => {
  return (
    <DashboardGuard>
      <DashboadHome />
    </DashboardGuard>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
