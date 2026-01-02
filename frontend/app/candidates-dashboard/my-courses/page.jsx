import dynamic from "next/dynamic";
import MyCourses from "@/components/dashboard-pages/candidates-dashboard/my-courses";
import DashboardGuard from "@/components/auth/DashboardGuard";

export const metadata = {
  title: "My Courses || Find Cleaner",
  description: "Access your enrolled courses and training materials.",
};

const index = () => {
  return (
    <DashboardGuard>
      <MyCourses />
    </DashboardGuard>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
