import dynamic from "next/dynamic";
import DashboardGuard from "@/components/auth/DashboardGuard";

const EmployerSettings = dynamic(
  () => import("@/components/dashboard-pages/employers-dashboard/settings"),
  { ssr: false }
);

export const metadata = {
  title: "Settings || Find Cleaner - Cleaning Job Management Portal",
  description: "Manage your account and notification preferences.",
};

const SettingsPage = () => {
  return (
    <DashboardGuard allowedRoles={["employer"]}>
      <EmployerSettings />
    </DashboardGuard>
  );
};

export default SettingsPage;
