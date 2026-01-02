import dynamic from "next/dynamic";
import ShortListedJobs from "@/components/dashboard-pages/candidates-dashboard/short-listed-jobs";

export const metadata = {
  title: "Shortlisted Jobs || Find Cleaner - Save Your Favorite Cleaning Jobs",
description: "View and manage your shortlisted cleaning jobs on Find Cleaner. Keep track of opportunities you’re interested in and apply when you’re ready."
};

const index = () => {
  return (
    <>
      <ShortListedJobs />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
