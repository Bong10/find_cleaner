import dynamic from "next/dynamic";
import DashboardGuard from "@/components/auth/DashboardGuard";

const CandidateSettings = dynamic(
  () => import("@/components/dashboard-pages/candidates-dashboard/settings"),
  { ssr: false }
);

export const metadata = {
  title: "Settings || Find Cleaner - Cleaner Dashboard",
  description: "Manage your account and notification preferences.",
};

const SettingsPage = () => {
  return (
    <DashboardGuard allowedRoles={["candidate", "cleaner"]}>
      <CandidateSettings />
    </DashboardGuard>
  );
};

export default SettingsPage;
