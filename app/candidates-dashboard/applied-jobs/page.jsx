import dynamic from "next/dynamic";
import AppliedJobs from "@/components/dashboard-pages/candidates-dashboard/applied-jobs";

export const metadata = {
 title: "My Applications || Find Cleaner - Cleaning Jobs Dashboard",
description: "Keep track of your cleaning job applications on Find Cleaner. Check statuses, manage interviews, and stay updated on your hiring progress."
};

const index = () => {
  return (
    <>
      <AppliedJobs />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
