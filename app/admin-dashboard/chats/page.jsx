import dynamic from "next/dynamic";

export const metadata = {
  title: "Chat Moderation | Find Cleaner Admin",
  description: "Monitor and manage user conversations",
  robots: "noindex, nofollow",
};

const AdminChats = dynamic(
  () => import("@/components/dashboard-pages/admin-dashboard/chats"),
  { ssr: false }
);

const AdminChatsPage = () => {
  return (
    <>
      <AdminChats />
    </>
  );
};

export default AdminChatsPage;
