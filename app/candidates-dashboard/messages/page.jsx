import dynamic from "next/dynamic";
import Messages from "@/components/dashboard-pages/candidates-dashboard/messages";

export const metadata = {
 title: "Messages || Find Cleaner - Secure Communication Hub",
description: "Stay connected on Find Cleaner. Send and receive messages between cleaners and employers to coordinate cleaning jobs with ease."
};

const index = () => {
  return (
    <>
      <Messages />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
