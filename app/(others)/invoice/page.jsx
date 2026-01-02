import dynamic from "next/dynamic";

import Invoice from "@/components/pages-menu/invoice";

export const metadata = {
 title: "Invoice || Find Cleaner - Cleaning Job Payments & Billing",
description: "View and manage your Find Cleaner invoices securely. Track cleaning job payments, download receipts, and keep your billing information organized in one place."
  
}



const index = () => {
  return (
    <>
      
      <Invoice />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
