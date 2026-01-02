import dynamic from "next/dynamic";
import ShopList from "@/components/shop/shop-list";

export const metadata = {
  title: "Shop List || Find Cleaner - Cleaning Tools & Service Packages",
description: "Browse Find Cleaner’s shop to explore cleaning service packages, tools, and premium job posting options for cleaners and employers."
};

const index = () => {
  return (
    <>
      <ShopList />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
