import dynamic from "next/dynamic";

export const metadata = {
  title: "Reports & Analytics | TidyLinker Admin",
  description: "View insights and generate reports",
  robots: "noindex, nofollow",
};

const AdminReports = dynamic(
  () => import("@/components/dashboard-pages/admin-dashboard/reports"),
  { ssr: false }
);

const AdminReportsPage = () => {
  return (
    <>
      <AdminReports />
    </>
  );
};

export default AdminReportsPage;
