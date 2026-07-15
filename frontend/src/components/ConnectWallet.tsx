"use client";

import React, { useEffect, useState, useRef } from "react";
import { authenticate } from "@stacks/connect";
import { getUserSession } from "@/lib/stacks-session";
import { Wallet, Copy, Check, LogOut, ExternalLink } from "lucide-react";

export default function ConnectWallet() {
    const [mounted, setMounted] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        const userSession = getUserSession();
        if (userSession.isSignInPending()) {
            userSession.handlePendingSignIn().then((pd) => {
                setUserData(pd);
            });
        } else if (userSession.isUserSignedIn()) {
            setUserData(userSession.loadUserData());
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!mounted) {
        return (
            <button
                disabled
                className="btn-glow px-3.5 py-2.5 bg-brand/50 text-white/50 rounded-none flex items-center gap-2 text-sm font-semibold animate-pulse"
            >
                <Wallet size={14} />
                Connect
            </button>
        );
    }

    const connect = () => {
        const userSession = getUserSession();
        authenticate({
            appDetails: {
                name: "Aegis",
                icon: window.location.origin + "/favicon.ico",
            },
            redirectTo: "/",
            onFinish: () => {
                setUserData(userSession.loadUserData());
            },
            userSession,
        });
    };

    const disconnect = () => {
        const userSession = getUserSession();
        userSession.signUserOut("/");
        setUserData(null);
        setDropdownOpen(false);
    };

    const copyAddress = () => {
        const addr = getAddress();
        if (addr !== "Unknown") {
            navigator.clipboard.writeText(addr);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const getAddress = () => {
        return userData?.profile?.stxAddress?.mainnet || userData?.profile?.stxAddress?.testnet || "Unknown";
    };

    if (userData) {
        const stxAddress = getAddress();
        const shortAddress = stxAddress !== "Unknown"
            ? `${stxAddress.substring(0, 4)}...${stxAddress.substring(stxAddress.length - 4)}`
            : stxAddress;

        const isMainnet = !!userData?.profile?.stxAddress?.mainnet;

        return (
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-none flex items-center gap-2 transition-all active:scale-[0.98] text-sm font-medium border border-transparent hover:border-border"
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot-green" />
                    <span className="font-[var(--font-mono)] tabular-nums">{shortAddress}</span>
                    <span className={`network-badge ${isMainnet ? "mainnet" : "testnet"}`}>
                        {isMainnet ? "M" : "T"}
                    </span>
                </button>

                {dropdownOpen && (
                    <div className="wallet-dropdown">
                        <div className="px-3 py-2.5 border-b border-white/5">
                            <p className="data-label mb-1">Connected Wallet</p>
                            <p className="font-[var(--font-mono)] text-xs text-zinc-300 tabular-nums break-all leading-relaxed">
                                {stxAddress}
                            </p>
                        </div>

                        <div className="py-1">
                            <button onClick={copyAddress} className="wallet-dropdown-item">
                                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                {copied ? "Copied!" : "Copy Address"}
                            </button>
                            <a
                                href={`https://explorer.hiro.so/address/${stxAddress}?chain=${isMainnet ? "mainnet" : "testnet"}`}
                                target="_blank"
                                rel="noreferrer"
                                className="wallet-dropdown-item"
                            >
                                <ExternalLink size={14} />
                                View on Explorer
                            </a>
                        </div>

                        <div className="py-1 border-t border-white/5">
                            <button onClick={disconnect} className="wallet-dropdown-item danger">
                                <LogOut size={14} />
                                Disconnect
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <button
            onClick={connect}
            className="btn-glow px-3.5 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-none flex items-center gap-2 transition-all active:scale-[0.98] text-sm font-semibold"
        >
            <Wallet size={14} />
            Connect
        </button>
    );
}
