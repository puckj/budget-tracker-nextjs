"use client"; // ต้องเป็น client-side
import { ReactNode } from "react";
import { useTheme } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const ClerkProviderWrapper = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme(); // ดึงค่าธีมจาก next-themes
  //   console.log("Current theme:", theme);

  return (
    <ClerkProvider
      appearance={{ baseTheme: theme === "dark" ? dark : undefined }}
    >
      {children}
    </ClerkProvider>
  );
};

export default ClerkProviderWrapper;
