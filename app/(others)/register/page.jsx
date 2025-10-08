import dynamic from "next/dynamic";

import RegisterForm from "@/components/pages-menu/register";

export const metadata = {
 title: "Sign Up || TidyLinker - Start Hiring or Finding Cleaning Jobs",
description: "Join TidyLinker to connect with trusted cleaners or find cleaning jobs near you. Quick, secure, and completely free to get started."
  
}



const index = () => {
  return (
    <>
      
      <RegisterForm />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
