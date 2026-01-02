import dynamic from "next/dynamic";
import Checkout from "@/components/shop/checkout";

export const metadata = {
  title: "Checkout || Find Cleaner - Secure Payment for Cleaning Services & Plans",
description: "Complete your Find Cleaner purchase securely. Review your selected plans or job postings, enter payment details, and finalize your order with confidence."
};

const index = () => {
  return (
    <>
      <Checkout />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
