import dynamic from "next/dynamic";

import Contact from "@/components/pages-menu/contact";

export const metadata = {
  title: "Contact Us || Find Cleaner - Cleaner & Job Support",
description: "Reach out to Find Cleaner for inquiries about hiring cleaners or finding cleaning jobs. Our support team is ready to assist with your account or listings."
  
}



const index = () => {
  return (
    <>
      
      <Contact />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
