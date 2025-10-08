import dynamic from "next/dynamic";
import Seo from "../../../components/common/Seo";
import AllApplicants from "../../../components/dashboard-pages/employers-dashboard/all-applicants";

export const metadata = {
 title: "All Applicants || TidyLinker - Find Reliable Cleaners & Cleaning Jobs",
description: "Discover and manage all cleaner applications on TidyLinker. The trusted job board where people hire cleaners and cleaners find verified cleaning jobs easily."
  
}



const index = () => {
  return (
    <>

      <AllApplicants />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
