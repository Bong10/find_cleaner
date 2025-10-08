import dynamic from "next/dynamic";

import CandidatesList from "@/components/candidates-listing-pages/candidates-list-v3";

export const metadata = {
  title: "Hire Local Cleaners or Find Cleaning Work – TidyLinker",
description: "Discover professional cleaners near you or find cleaning jobs that match your skills. TidyLinker is the trusted marketplace for connecting cleaners and clients securely."
  
}


const index = () => {
  return (
    <>
      
      <CandidatesList />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
