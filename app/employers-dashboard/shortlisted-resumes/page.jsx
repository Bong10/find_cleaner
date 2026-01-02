import dynamic from "next/dynamic";
import ShortlistedResumes from "@/components/dashboard-pages/employers-dashboard/shortlisted-resumes";

export const metadata = {
  title: "Shortlisted Resumes || Find Cleaner - Save and Review Cleaner Profiles",
description: "Access your shortlisted cleaner resumes on Find Cleaner. Review saved candidates, compare experience, and contact top cleaners for your next job."
};

const index = () => {
  return (
    <>
      <ShortlistedResumes />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
