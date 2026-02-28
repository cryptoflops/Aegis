"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ConnectWallet = dynamic(() => import("./ConnectWallet"), { ssr: false });

const NAV_LINKS = [
    { href: "/agents", label: "Agents" },
    { href: "/quests", label: "My Quests" },
    { href: "/docs", label: "Docs" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <nav className="border-b border-border bg-panel/60 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                        <div className="relative">
                            <div className="absolute inset-0 bg-brand/20 rounded-lg blur-md group-hover:blur-lg transition-all" />
                            <div className="relative bg-brand/10 p-1.5 rounded-lg border border-brand/20">
                                <Shield className="text-brand" size={20} />
                            </div>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
                            Aegis
                        </span>
                        <span className="hidden sm:block data-label text-brand/60 ml-1 mt-0.5">v0.1</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${pathname === link.href
                                        ? "text-brand bg-brand/10"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="w-px h-5 bg-border mx-3" />
                        <ConnectWallet />
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden flex items-center gap-3">
                        <ConnectWallet />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-zinc-400 hover:text-white transition-colors"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-border bg-panel/95 backdrop-blur-xl">
                    <div className="px-4 py-3 flex flex-col gap-1">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname === link.href
                                        ? "text-brand bg-brand/10 border-l-2 border-brand"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
