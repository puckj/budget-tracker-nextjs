"use client";

import React, { useState } from "react";
import Logo from "./Logo";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { UserButton } from "@clerk/nextjs";
import { ThemeSwitcherBtn } from "./ThemeSwitcherBtn";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";

const navbarItemsData = [
  { label: "Dashboard", link: "/" },
  { label: "Transactions", link: "/transactions" },
  { label: "Manage", link: "/manage" },
];

const DesktopNavBar = () => {
  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <nav className="container flex items-center justify-between px-8">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo />
          <div className="flex h-full">
            {navbarItemsData.map((item, index) => (
              <NavBarItem key={index} link={item.link} label={item.label} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherBtn />
          <UserButton afterSwitchSessionUrl="/sign-in" />
        </div>
      </nav>
    </div>
  );
};

const MobileNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]" side="left">
            <Logo />
            <div className="flex flex-col gap-1 pt-4">
              {navbarItemsData.map((item, index) => (
                <NavBarItem
                  key={index}
                  link={item.link}
                  label={item.label}
                  clickCallBack={() => setIsOpen((prev) => !prev)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo isOnMobile />
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherBtn />
          <UserButton afterSwitchSessionUrl="/sign-in" />
        </div>
      </nav>
    </div>
  );
};

const NavBarItem = ({
  link,
  label,
  clickCallBack,
}: {
  link: string;
  label: string;
  clickCallBack?: () => void;
}) => {
  const pathname = usePathname();
  const isActive = pathname === link;
  return (
    <div className="relative flex items-center">
      <Link
        onClick={() => {
          if (clickCallBack) clickCallBack();
        }}
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
          isActive && "text-foreground",
        )}
      >
        {label}
      </Link>
      {isActive && (
        <div
          className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2
            rounded-xl bg-foreground"
        />
      )}
    </div>
  );
};

const NavBar = () => {
  return (
    <>
      <DesktopNavBar />
      <MobileNavBar />
    </>
  );
};

export default NavBar;
