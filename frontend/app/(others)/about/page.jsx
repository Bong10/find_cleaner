import dynamic from "next/dynamic";

import About from "@/components/pages-menu/about";

export const metadata = {
  title: "About Us || Find Cleaner - Connecting Cleaners with Opportunities",
  description: "Learn about Find Cleaner's mission to revolutionize cleaning services. We connect skilled cleaners with clients through a trusted, secure platform. Join our community of 15,000+ active cleaners and discover quality cleaning opportunities."
}



const index = () => {
  return (
    <>
      
      <About />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
