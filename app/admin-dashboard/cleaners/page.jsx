import dynamic from "next/dynamic";

export const metadata = {
  title: "Cleaners Management | TidyLinker Admin",
  description: "Manage all registered cleaners",
  robots: "noindex, nofollow",
};

const AdminCleaners = dynamic(
  () => import("@/components/dashboard-pages/admin-dashboard/cleaners"),
  { ssr: false }
);

const AdminCleanersPage = () => {
  return (
    <>
      <AdminCleaners />
    </>
  );
};

export default AdminCleanersPage;
