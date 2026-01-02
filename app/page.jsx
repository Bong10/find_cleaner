import Wrapper from "@/layout/Wrapper";
import Home from "@/components/home";

export const metadata = {
  title: "Find Cleaner – Simplifying Cleaning Solutions and Connections",
  description: "Find Cleaner is a cutting-edge platform connecting employers, professional cleaners, and administrators to streamline cleaning services",
};

export default function page() {
  return (
    <Wrapper>
      <Home />
    </Wrapper>
  );
}
