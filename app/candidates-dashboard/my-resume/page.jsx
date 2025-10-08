import dynamic from "next/dynamic";
import MyResume from "@/components/dashboard-pages/candidates-dashboard/my-resume";

export const metadata = {
  title: "My Resume || TidyLinker - Build Your Cleaner Profile",
description: "Edit and update your cleaner resume on TidyLinker. Present your experience and qualifications to connect with verified employers easily."
};

const index = () => {
  return (
    <>
      <MyResume />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
