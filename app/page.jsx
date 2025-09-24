import Wrapper from "@/layout/Wrapper";
import Home from "@/components/home";

export const metadata = {
  title: "TidyLinker – Simplifying Cleaning Solutions and Connections",
  description: "TidyLinker is a cutting-edge platform connecting employers, professional cleaners, and administrators to streamline cleaning services",
};

export default function page() {
  return (
    <Wrapper>
      <Home />
    </Wrapper>
  );
}
