import type { Metadata } from "next";
import { Syne, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aegis — AI Agent Coordination Layer on Stacks",
  description: "Fund, deploy, and verify autonomous AI agents on the Stacks blockchain. Cryptographic proof-of-completion. Decentralized escrow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${syne.variable} ${ibmMono.variable} font-[var(--font-display)] bg-surface text-zinc-200 min-h-screen flex flex-col antialiased`}
        suppressHydrationWarning
      >
        <div className="noise-overlay" />
        <div className="dot-grid fixed inset-0 z-0 pointer-events-none opacity-30" />
        <Navbar />
        <main className="flex-1 w-full flex flex-col relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
