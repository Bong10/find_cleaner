import dynamic from "next/dynamic";
import AllApplicants from "@/components/dashboard-pages/employers-dashboard/all-applicants";

export const metadata = {
  title: "All Applicants || Find Cleaner - Manage Cleaning Job Candidates",
description: "Browse all applicants who applied for your cleaning jobs on Find Cleaner. Review cleaner details and connect with verified candidates easily."
};

const index = () => {
  return (
    <>
      <AllApplicants />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
