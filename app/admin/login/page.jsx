import dynamic from "next/dynamic";
import AdminLogin from "@/components/pages-menu/admin-login";

export const metadata = {
  title: "Admin Login || TidyLinker - Admin Portal",
  description: "Secure admin login for TidyLinker management portal. Restricted access for authorized personnel only.",
  robots: "noindex, nofollow", // Don't index admin login page
};

const Page = () => {
  return <AdminLogin />;
};

export default dynamic(() => Promise.resolve(Page), { ssr: false });
