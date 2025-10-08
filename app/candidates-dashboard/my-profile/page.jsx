import dynamic from "next/dynamic";
import MyProfile from "@/components/dashboard-pages/candidates-dashboard/my-profile";

export const metadata = {
 title: "My Profile || TidyLinker - Account Settings & Profile Management",
description: "Edit your TidyLinker profile, manage your information, and showcase your experience to attract the right cleaning jobs or cleaners."
};

const index = () => {
  return (
    <>
      <MyProfile />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
