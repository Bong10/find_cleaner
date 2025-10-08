import dynamic from "next/dynamic";
import AppliedJobs from "@/components/dashboard-pages/candidates-dashboard/applied-jobs";

export const metadata = {
 title: "My Applications || TidyLinker - Cleaning Jobs Dashboard",
description: "Keep track of your cleaning job applications on TidyLinker. Check statuses, manage interviews, and stay updated on your hiring progress."
};

const index = () => {
  return (
    <>
      <AppliedJobs />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
