import dynamic from "next/dynamic";

const AdminSettings = dynamic(() => import("@/components/dashboard-pages/admin-dashboard/settings"), {
  ssr: false,
});

export const metadata = {
  title: "Settings | TidyLinker Admin",
  description: "Admin dashboard settings and preferences",
  robots: "noindex"
};

const SettingsPage = () => {
  return (
    <>
      <AdminSettings />
    </>
  );
};

export default SettingsPage;
