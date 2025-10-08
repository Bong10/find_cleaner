import dynamic from "next/dynamic";
import Messages from "@/components/dashboard-pages/employers-dashboard/messages";

export const metadata = {
  title: "Messages || TidyLinker - Secure Chat for Cleaning Jobs",
description: "Stay connected on TidyLinker. Send and receive messages between cleaners and employers to coordinate job details quickly and safely."
};

const index = () => {
  return (
    <>
      <Messages />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
