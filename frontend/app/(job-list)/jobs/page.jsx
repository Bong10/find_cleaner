import dynamic from "next/dynamic";
import JobList from "@/components/job-listing-pages/jobs";

export const metadata = {
  title: "Jobs || Find Cleaner - Find Cleaning Jobs & Opportunities",
description: "Browse the latest cleaning jobs on Find Cleaner. Apply for domestic, office, and commercial cleaning roles near you and connect with verified employers easily."
};

const index = () => {
  return (
    <>
      <JobList />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
