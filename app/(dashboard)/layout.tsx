import NavBar from "@/components/NavBar";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex h-screen w-full flex-col">
      <NavBar />
      <div className="w-full">{children}</div>
    </div>
  );
};

export default layout;
