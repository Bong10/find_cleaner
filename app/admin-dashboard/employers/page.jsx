import dynamic from "next/dynamic";

export const metadata = {
  title: "Employers Management | Find Cleaner Admin",
  description: "Manage all registered employers",
  robots: "noindex, nofollow",
};

const AdminEmployers = dynamic(
  () => import("@/components/dashboard-pages/admin-dashboard/employers"),
  { ssr: false }
);

const AdminEmployersPage = () => {
  return (
    <>
      <AdminEmployers />
    </>
  );
};

export default AdminEmployersPage;
