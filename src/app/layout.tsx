import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nutrição diária",
  description: "Acompanhe calorias, metabolismo basal e macronutrientes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${sora.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#f2f5f1] font-[var(--font-sora)] text-[#1a241f]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
