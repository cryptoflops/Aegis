import type { Metadata } from "next";
import { Syne, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WebGLBackground from "@/components/WebGLBackground";
import MouseTracker from "@/components/MouseTracker";

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
  title: "Aegis - AI Agent Coordination Layer on Stacks",
  description:
    "Fund, deploy, and verify autonomous AI agents on the Stacks blockchain. Cryptographic proof-of-completion. Decentralized escrow.",
  other: {
    "talentapp:project_verification":
      "8695c16e62c23814358a3a108643a1d2df482f83b22c53c2a422e1142fe8aa50958fbe16e8786aded19dc2f87a4f9f86c36b96d8d611256a806e739c76b120fa",
  },
  icons: {
    icon: "/logo_icon.png",
    apple: "/logo_icon.png",
  },
};

import { authenticate } from '../lib/stacks-integration';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Setup Stacks network configurations for wallet connection
  if (typeof window !== 'undefined') {
    console.debug('Stacks network module active. Connect function:', authenticate);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||(!t&&window.matchMedia("(prefers-color-scheme: light)").matches)){document.documentElement.classList.remove("dark")}else{document.documentElement.classList.add("dark")}}catch(e){}})();` }} />
      </head>
      <body
        className={`${syne.variable} ${ibmMono.variable} font-[var(--font-display)] bg-[var(--color-surface)] text-[var(--color-foreground)] min-h-screen flex flex-col antialiased`}
        suppressHydrationWarning
      >
        <WebGLBackground />
        <MouseTracker />
        <div className="noise-overlay" />
        <div className="dot-grid fixed inset-0 z-0 pointer-events-none opacity-20" />
        <Navbar />
        <main className="relative z-10 flex flex-1 w-full flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
