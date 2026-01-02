import Verification from "@/components/dashboard-pages/candidates-dashboard/verification";

export const metadata = {
  title: "Verification Status || TidyLinker - Connecting Cleaners to Homes",
  description: "View your verification status including DBS check, ID verification, CV, and references.",
};

export default function Page() {
  return (
    <>
      <Verification />
    </>
  );
}
