import dynamic from "next/dynamic";
import CleanerBookingManagement from "@/components/dashboard-pages/candidates-dashboard/cleaner-bookings";

export const metadata = {
  title: "My Bookings || TidyLinker - Manage Your Cleaning Jobs",
  description: "Manage your cleaning job bookings, confirm appointments, and track your work history on TidyLinker.",
};

const index = () => {
  return (
    <>
      <CleanerBookingManagement />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });