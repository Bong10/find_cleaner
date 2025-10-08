import dynamic from "next/dynamic";
import ManageJobs from "@/components/dashboard-pages/employers-dashboard/manage-jobs";

export const metadata = {
 title: "Manage Jobs || TidyLinker - Cleaning Job Listings Dashboard",
description: "View and manage all your cleaning job listings on TidyLinker. Keep your posts organized and monitor applications in real time."
};

const index = () => {
  return (
    <>
      <ManageJobs />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
