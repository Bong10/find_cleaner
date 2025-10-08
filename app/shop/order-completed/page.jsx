import dynamic from "next/dynamic";
import OrderCompleted from "@/components/shop/order-completed";

export const metadata = {
  title: "Order Completed || TidyLinker - Payment Successful",
description: "Your TidyLinker order has been successfully completed. Thank you for your purchase—your cleaning job post or subscription plan is now active."
};

const index = () => {
  return (
    <>
      <OrderCompleted />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
