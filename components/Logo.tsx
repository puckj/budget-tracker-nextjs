import { PiggyBank } from "lucide-react";
import React from "react";

const Logo = ({ isOnMobile }: { isOnMobile?: boolean }) => {
  return (
    <a href="/" className="flex items-center gap-2">
      {!isOnMobile && (
        <PiggyBank className="stroke h-11 w-11 stroke-amber-500 stroke-[1.5]" />
      )}
      <p
        className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold
          leading-tight tracking-tighter text-transparent"
      >
        BudgetTracker
      </p>
    </a>
  );
};

export default Logo;
