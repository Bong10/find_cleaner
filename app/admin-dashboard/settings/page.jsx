import dynamic from "next/dynamic";
import DashboardGuard from "@/components/auth/DashboardGuard";

const AdminSettings = dynamic(() => import("@/components/dashboard-pages/admin-dashboard/settings"), {
  ssr: false,
});

export const metadata = {
  title: "Settings | Find Cleaner Admin",
  description: "Admin dashboard settings and preferences",
  robots: "noindex"
};

const SettingsPage = () => {
  return (
    <DashboardGuard allowedRoles={["admin"]}>
      <AdminSettings />
    </DashboardGuard>
  );
};

export default SettingsPage;
