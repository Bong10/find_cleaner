import dynamic from "next/dynamic";

export const metadata = {
  title: "Admin Overview | Find Cleaner",
  description: "Admin dashboard overview and statistics",
  robots: "noindex, nofollow",
};

const AdminOverview = dynamic(
  () => import("@/components/dashboard-pages/admin-dashboard/overview"),
  { ssr: false }
);

const AdminOverviewPage = () => {
  return (
    <>
      <AdminOverview />
    </>
  );
};

export default AdminOverviewPage;
