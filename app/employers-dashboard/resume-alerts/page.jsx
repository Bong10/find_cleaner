import dynamic from "next/dynamic";
import ResumeAlerts from "@/components/dashboard-pages/employers-dashboard/resume-alerts";

export const metadata = {
  title: "Resume Alerts || TidyLinker - Cleaner Resume Notifications",
description: "Manage your TidyLinker resume alerts and get instant updates when verified cleaners post new resumes that fit your hiring needs."
};

const index = () => {
  return (
    <>
      <ResumeAlerts />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
