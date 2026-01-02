import dynamic from "next/dynamic";

import Faq from "@/components/pages-menu/faq";

export const metadata = {
  title: "FAQ || Find Cleaner - Frequently Asked Questions",
description: "Find answers to common questions about using Find Cleaner. Learn how to hire cleaners, apply for cleaning jobs, manage profiles, and make secure payments."
  
}



const index = () => {
  return (
    <>
      
      <Faq />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
