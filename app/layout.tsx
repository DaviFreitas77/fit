import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { PwaRegister } from "@/components/PwaRegister";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitApp",
  description: "Seu aplicativo fitness",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FitApp",
  },
  icons: {
    icon: "/icon-192.svg",
    apple: "/icon-192.svg",
  },
};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${sora.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#f2f5f1] font-[var(--font-sora)] text-[#1a241f]">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
