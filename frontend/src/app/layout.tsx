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

export const meta Metadata = {
  title: "Aegis — AI Agent Coordination Layer on Stacks",
  description:
    "Fund, deploy, and verify autonomous AI agents on the Stacks blockchain. Cryptographic proof-of-completion. Decentralized escrow.",
  other: {
    "talentapp:project_verification":
      "8695c16e62c23814358a3a108643a1d2df482f83b2c53c2a422e1142",
  },
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
        <main className="relative z-10 flex flex-1 w-full flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
