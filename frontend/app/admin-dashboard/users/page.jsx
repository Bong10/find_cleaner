import dynamic from "next/dynamic";

const UserManagement = dynamic(() => import("@/components/dashboard-pages/admin-dashboard/users"), {
  ssr: false,
});

export const metadata = {
  title: "User Management | Find Cleaner Admin",
  description: "Manage all platform users",
  robots: "noindex"
};

const UsersPage = () => {
  return (
    <>
      <UserManagement />
    </>
  );
};

export default UsersPage;
