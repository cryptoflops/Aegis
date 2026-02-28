"use client";

import React, { useEffect, useState } from "react";
import { authenticate } from "@stacks/connect";
import { userSession } from "@/lib/stacks-session";
import { Wallet } from "lucide-react";

export default function ConnectWallet() {
    const [mounted, setMounted] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        setMounted(true);
        if (userSession.isSignInPending()) {
            userSession.handlePendingSignIn().then((pd: any) => {
                setUserData(pd);
            });
        } else if (userSession.isUserSignedIn()) {
            setUserData(userSession.loadUserData());
        }
    }, []);

    if (!mounted) return null;

    const connect = () => {
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
        userSession.signUserOut("/");
        setUserData(null);
    };

    if (userData) {
        const stxAddress = userData.profile?.stxAddress?.testnet || userData.profile?.stxAddress?.mainnet || "Unknown";
        const shortAddress = stxAddress !== "Unknown" ? `${stxAddress.substring(0, 4)}...${stxAddress.substring(stxAddress.length - 4)}` : stxAddress;

        return (
            <button
                onClick={disconnect}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-lg flex items-center gap-2 transition-all text-sm font-medium border border-border"
            >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
                <span className="font-[var(--font-mono)]">{shortAddress}</span>
            </button>
        );
    }

    return (
        <button
            onClick={connect}
            className="btn-glow px-3.5 py-1.5 bg-brand hover:bg-brand-hover text-white rounded-lg flex items-center gap-2 transition-all text-sm font-semibold"
        >
            <Wallet size={14} />
            Connect
        </button>
    );
}
