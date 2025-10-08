import dynamic from "next/dynamic";

import Invoice from "@/components/pages-menu/invoice";

export const metadata = {
 title: "Invoice || TidyLinker - Cleaning Job Payments & Billing",
description: "View and manage your TidyLinker invoices securely. Track cleaning job payments, download receipts, and keep your billing information organized in one place."
  
}



const index = () => {
  return (
    <>
      
      <Invoice />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
