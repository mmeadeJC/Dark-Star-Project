import type { Metadata } from "next";
import { Geist, Geist_Mono, Russo_One } from "next/font/google";

import Galaxy from "@/components/Galaxy";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const russoOne = Russo_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-russo-one",
});

export const metadata: Metadata = {
  title: "Dark Star",
  description:
    "Dark Star — an AI-powered creative platform (placeholder landing page).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${russoOne.variable} h-full antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body className="relative min-h-full flex flex-col text-zinc-100">
        <Galaxy
          className="pointer-events-none fixed inset-0 z-0 block min-h-screen min-w-full"
          mouseInteraction={false}
          mouseRepulsion={false}
          transparent
          whiteStars
          brightness={0.5}
          focal={[0.5, 0.48]}
          hueShift={252}
          saturation={0.75}
          glowIntensity={0.3}
          density={1.28}
          starSpeed={0.18}
          twinkleIntensity={0.2}
          rotationSpeed={0.012}
          speed={0.38}
        />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
