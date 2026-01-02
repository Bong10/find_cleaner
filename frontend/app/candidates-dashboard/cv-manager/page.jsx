import dynamic from "next/dynamic";
import CvManager from "@/components/dashboard-pages/candidates-dashboard/cv-manager";

export const metadata = {
 title: "CV Manager || Find Cleaner - Build Your Cleaning Job Resume",
description: "Easily manage your cleaner resume and profile on Find Cleaner. Highlight your cleaning experience and get noticed by employers hiring near you."
};

const index = () => {
  return (
    <>
      <CvManager />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
