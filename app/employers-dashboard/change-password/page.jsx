import dynamic from "next/dynamic";
import ChangePassword from "@/components/dashboard-pages/employers-dashboard/change-password";

export const metadata = {
  title: "Change Password || TidyLinker - Account Security Settings",
description: "Change your TidyLinker account password securely. Protect your cleaner or employer profile and maintain safe access to your dashboard."
};

const index = () => {
  return (
    <>
      <ChangePassword />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
