import dynamic from "next/dynamic";

import LogIn from "@/components/pages-menu/login";

export const metadata = {
 title: "Login || Find Cleaner - Cleaner & Employer Portal",
description: "Sign in to Find Cleaner to manage your cleaning jobs, profile, and messages. Simple, fast, and secure access for cleaners and clients."
  
}



const index = () => {
  return (
    <>
      
      <LogIn />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
