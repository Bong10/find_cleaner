import dynamic from "next/dynamic";
import DashboadHome from "@/components/dashboard-pages/candidates-dashboard/dashboard";

export const metadata = {
 title: "Cleaner Dashboard || TidyLinker - Your Cleaning Jobs Hub",
description: "Manage your cleaning jobs, profile, and applications all in one place. TidyLinker helps cleaners stay organized and connected with trusted employers."
};

const index = () => {
  return (
    <>
      <DashboadHome />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
