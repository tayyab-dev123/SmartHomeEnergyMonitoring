import { Inter } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Smart Home Energy Monitor",
  description: "Monitor and understand your home energy consumption",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderWrapper>
          {children}
          <Toaster />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
