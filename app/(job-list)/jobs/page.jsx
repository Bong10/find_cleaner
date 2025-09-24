import dynamic from "next/dynamic";
import JobList from "@/components/job-listing-pages/jobs";

export const metadata = {
  title: "Jobs || TidyLinker Job Borad",
  description: "TidyLinker Job Borad",
};

const index = () => {
  return (
    <>
      <JobList />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
