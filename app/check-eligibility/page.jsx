import dynamic from "next/dynamic";
import CheckEligibility from "@/components/pages-menu/check-eligibility";

export const metadata = {
  title: "Check Eligibility for Support || Find Cleaner CIC",
  description: "Check if you qualify for subsidised cleaning services. Find Cleaner CIC offers support for elderly, disabled, and financially vulnerable households."
}

const index = () => {
  return (
    <>
      <CheckEligibility />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
