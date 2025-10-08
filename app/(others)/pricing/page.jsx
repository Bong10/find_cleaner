import dynamic from "next/dynamic";

import Pricing from "@/components/pages-menu/pricing";

export const metadata = {
  title: "Pricing || TidyLinker - Plans & Subscription Options",
description: "View TidyLinker’s pricing options for cleaners and employers. Transparent plans designed to help you hire or find cleaning work with no hidden fees."
  
}



const index = () => {
  return (
    <>
      
      <Pricing />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
