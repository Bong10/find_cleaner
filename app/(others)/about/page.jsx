import dynamic from "next/dynamic";

import About from "@/components/pages-menu/about";

export const metadata = {
  title: "About Us || TidyLinker - Cleaner & Cleaning Jobs Platform",
description: "TidyLinker is a modern job board designed to link cleaners with clients. Our mission is to make finding trusted cleaning services and jobs simple and secure."
  
}



const index = () => {
  return (
    <>
      
      <About />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
