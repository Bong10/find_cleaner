import dynamic from "next/dynamic";

const AdminProfile = dynamic(() => import("@/components/dashboard-pages/admin-dashboard/profile"), {
  ssr: false,
});

export const metadata = {
  title: "My Profile | TidyLinker Admin",
  description: "Admin profile and account settings",
  robots: "noindex"
};

const ProfilePage = () => {
  return (
    <>
      <AdminProfile />
    </>
  );
};

export default ProfilePage;
