import dynamic from "next/dynamic";

import BlogList from "@/components/blog-meu-pages/blog-list-v3";

export const metadata = {
 title: "TidyLinker Blog Details | Expert Cleaning Advice & Real-Life Job Stories",
description: "Read detailed cleaning guides, industry insights, and inspiring stories from professionals on TidyLinker — the platform that connects cleaners with real opportunities and clients who care.",
};

const index = () => {
  return (
    <>
      <BlogList />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
