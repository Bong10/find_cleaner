import dynamic from "next/dynamic";

import LogIn from "@/components/pages-menu/login";

export const metadata = {
 title: "Login || TidyLinker - Cleaner & Employer Portal",
description: "Sign in to TidyLinker to manage your cleaning jobs, profile, and messages. Simple, fast, and secure access for cleaners and clients."
  
}



const index = () => {
  return (
    <>
      
      <LogIn />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
