import dynamic from "next/dynamic";

export const metadata = {
  title: "Bookings Management | TidyLinker Admin",
  description: "Track and manage all service bookings",
  robots: "noindex, nofollow",
};

const AdminBookings = dynamic(
  () => import("@/components/dashboard-pages/admin-dashboard/bookings"),
  { ssr: false }
);

const AdminBookingsPage = () => {
  return (
    <>
      <AdminBookings />
    </>
  );
};

export default AdminBookingsPage;
