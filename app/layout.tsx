import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import RootProvider from "@/components/providers/RootProvider";
import { Toaster } from "sonner";
import ClerkProviderWrapper from "@/components/providers/ClerkProviderWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Budget Tracker",
  description: "Simple and effective budget tracking tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootProvider>
          <ClerkProviderWrapper>
            <Toaster richColors position="bottom-right" />
            {children}
          </ClerkProviderWrapper>
        </RootProvider>
      </body>
    </html>
  );
}
