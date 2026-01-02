import dynamic from "next/dynamic";
import Courses from "@/components/pages-menu/courses";

export const metadata = {
  title: "Courses | Find Cleaner",
  description:
    "Professional cleaning courses and training programs. Learn essential skills, get certified, and advance your cleaning career with Find Cleaner.",
};

const index = () => {
  return (
    <>
      <Courses />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
