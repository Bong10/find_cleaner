import dynamic from "next/dynamic";

export const metadata = {
  title: "Services Management | TidyLinker Admin",
  description: "Create and manage cleaning services",
  robots: "noindex, nofollow",
};

const AdminServices = dynamic(
  () => import("@/components/dashboard-pages/admin-dashboard/services"),
  { ssr: false }
);

const AdminServicesPage = () => {
  return (
    <>
      <AdminServices />
    </>
  );
};

export default AdminServicesPage;
