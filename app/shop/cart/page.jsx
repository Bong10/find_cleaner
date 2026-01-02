import dynamic from "next/dynamic";
import Cart from "@/components/shop/cart";

export const metadata = {
  title: "Cart || Find Cleaner - Manage Your Subscription Checkout",
description: "Check your selected Find Cleaner services, adjust quantities, and complete your secure checkout for cleaner or employer plans."
};

const index = () => {
  return (
    <>
      <Cart />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
