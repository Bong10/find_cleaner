import dynamic from "next/dynamic";

import Faq from "@/components/pages-menu/faq";

export const metadata = {
  title: "FAQ || TidyLinker - Frequently Asked Questions",
description: "Find answers to common questions about using TidyLinker. Learn how to hire cleaners, apply for cleaning jobs, manage profiles, and make secure payments."
  
}



const index = () => {
  return (
    <>
      
      <Faq />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
