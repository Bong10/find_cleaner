import dynamic from "next/dynamic";
import EmployerBookingManagement from "@/components/dashboard-pages/employers-dashboard/employer-bookings";

export const metadata = {
  title: "Booking Management || TidyLinker - Manage Cleaner Bookings",
  description: "Manage your cleaner bookings, process payments, and track job completion on TidyLinker.",
};

const index = () => {
  return (
    <>
      <EmployerBookingManagement />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });