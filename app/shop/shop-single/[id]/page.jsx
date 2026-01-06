import ShopDetails from "@/components/shop/shop-single/ShopDetails";
import dynamic from "next/dynamic";

export const metadata = {
  title: "Shop Details || Find Cleaner - Cleaning Packages & Product Information",
description: "View detailed information about Find Cleaner’s cleaning service packages, job posting plans, and professional tools. Compare features and purchase securely."
};

const ShopSingleDyanmic = ({ params }) => {
  return (
    <>
      <ShopDetails id={params.id} />
    </>
  );
};

export default dynamic(() => Promise.resolve(ShopSingleDyanmic), {
  ssr: false,
});
