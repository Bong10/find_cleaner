import dynamic from "next/dynamic";
import ChangePassword from "@/components/dashboard-pages/employers-dashboard/change-password";

export const metadata = {
  title: "Change Password || Find Cleaner - Account Security Settings",
description: "Change your Find Cleaner account password securely. Protect your cleaner or employer profile and maintain safe access to your dashboard."
};

const index = () => {
  return (
    <>
      <ChangePassword />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
