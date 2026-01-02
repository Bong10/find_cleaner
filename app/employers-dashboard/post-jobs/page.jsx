import dynamic from "next/dynamic";
import PostJob from "@/components/dashboard-pages/employers-dashboard/post-jobs";

export const metadata = {
 title: "Post a Job || Find Cleaner - Hire Trusted Cleaners Easily",
description: "Post your cleaning job on Find Cleaner to reach verified and professional cleaners. Add job details, set your rate, and start receiving applications quickly."
};

const index = () => {
  return (
    <>
      <PostJob />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
