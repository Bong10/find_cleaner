import dynamic from "next/dynamic";
import CommunityImpact from "@/components/community-impact";

export const metadata = {
  title: "Community Impact || Find Cleaner CIC - Giving Back to Our Community",
  description: "Discover how Find Cleaner CIC reinvests profits into cleaner training, fair wages, and support for vulnerable clients. As a Community Interest Company, we exist to benefit the community."
}

const index = () => {
  return (
    <>
      <CommunityImpact />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
