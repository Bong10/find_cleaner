import dynamic from "next/dynamic";

export const metadata = {
  title: "Jobs Management | Find Cleaner Admin",
  description: "Monitor and manage all job postings",
  robots: "noindex, nofollow",
};

const AdminJobs = dynamic(
  () => import("@/components/dashboard-pages/admin-dashboard/jobs"),
  { ssr: false }
);

const AdminJobsPage = () => {
  return (
    <>
      <AdminJobs />
    </>
  );
};

export default AdminJobsPage;
