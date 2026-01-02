import dynamic from "next/dynamic";
import SupportProgrammes from "@/components/community-impact/SupportProgrammes";

export const metadata = {
  title: "Support Programmes || Find Cleaner CIC - Help for Vulnerable Clients",
  description: "Find Cleaner CIC offers subsidised and sponsored cleaning sessions for elderly, disabled and vulnerable people. Learn how we make cleaning accessible to those who need it most."
}

const index = () => {
  return (
    <>
      <SupportProgrammes />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
