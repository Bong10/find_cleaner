import dynamic from "next/dynamic";
import ChangePassword from "@/components/dashboard-pages/candidates-dashboard/change-password";

export const metadata = {
  title: "Change Password || Find Cleaner - Account Security Settings",
description: "Change your Find Cleaner password to protect your account and maintain secure access to your cleaning jobs and bookings."
};

const index = () => {
  return (
    <>
      <ChangePassword />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
