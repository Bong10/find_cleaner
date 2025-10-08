import dynamic from "next/dynamic";

import Terms from "@/components/pages-menu/terms";

export const metadata = {
  title: "Terms || TidyLinker - User Agreement & Platform Policies",
description: "Review the official TidyLinker terms outlining usage rules, privacy standards, and guidelines for hiring and working through our cleaning job platform."
  
}



const index = () => {
  return (
    <>
      
      <Terms />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
