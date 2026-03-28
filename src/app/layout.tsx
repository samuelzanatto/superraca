import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import TransitionProvider from "@/components/transition-provider";

import { AuthProvider } from "@/components/auth-provider";
import { CustomCursor } from "@/components/custom-cursor";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Header } from "@/components/header";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Super Raça",
  description: "",
  keywords: ["Super Raça"],
  authors: [{ name: "Super Raça" }],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Super Raça",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark scroll-smooth" suppressHydrationWarning>
      <body
        className={`${poppins.className} antialiased bg-white`}
        suppressHydrationWarning
      >
        <SmoothScroll>
          <CustomCursor />
          <Header />
          <TransitionProvider>
            <AuthProvider>{children}</AuthProvider>
          </TransitionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}

