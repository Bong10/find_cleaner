import dynamic from "next/dynamic";

import CandidatesList from "@/components/candidates-listing-pages/candidates-list-v1";

export const metadata = {
  title: "TidyLinker || Cleaner & Cleaning Jobs Marketplace",
description: "TidyLinker is a modern cleaner job board where people can find trusted cleaners and cleaners can find verified cleaning jobs. Connect, apply, and hire with ease."
  
}


const index = () => {
  return (
    <>
      
      <CandidatesList />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
