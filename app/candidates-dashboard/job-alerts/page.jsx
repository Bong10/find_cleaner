import dynamic from "next/dynamic";
import JobAlerts from "@/components/dashboard-pages/candidates-dashboard/job-alerts";

export const metadata = {
  title: "Job Alerts || TidyLinker - New Cleaning Job Notifications",
description: "View and manage your cleaning job alerts on TidyLinker. Get instant updates on the latest job openings near you."
};

const index = () => {
  return (
    <>
      <JobAlerts />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
