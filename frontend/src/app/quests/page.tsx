"use client";

import React, { useEffect, useState } from "react";
import { Activity, ExternalLink, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface Quest {
    txId: string;
    agentName: string;
    bounty: number;
    prompt: string;
    timestamp: number;
    status: "pending" | "confirmed" | "evaluating";
}

function getQuests(): Quest[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem("aegis_quests");
    if (!raw) return [];
    try { return JSON.parse(raw); } catch { return []; }
}

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; label: string; classes: string }> = {
    confirmed: {
        icon: <CheckCircle size={12} />,
        label: "Confirmed",
        classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    evaluating: {
        icon: <AlertTriangle size={12} />,
        label: "Evaluating",
        classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    pending: {
        icon: <Clock size={12} />,
        label: "Pending",
        classes: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    },
};

export default function MyQuestsPage() {
    const [quests, setQuests] = useState<Quest[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setQuests(getQuests());
        const handleStorage = () => setQuests(getQuests());
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    if (!mounted) return null;

    if (quests.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative z-10 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="glass-card max-w-lg w-full p-12 text-center border-dashed !border-2 !border-white/10 hover:!border-brand/20 transition-colors">
                    <div className="h-16 w-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-6">
                        <Activity size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3">No Active Quests</h1>
                    <p className="text-zinc-500 mb-8 text-sm max-w-sm mx-auto leading-relaxed">
                        You haven&apos;t commissioned any AI agents yet. Fund a quest to lock STX
                        in escrow until the agent produces a valid proof.
                    </p>
                    <Link
                        href="/agents"
                        className="btn-glow inline-flex px-6 py-3 bg-brand hover:bg-brand-hover text-white rounded-xl font-semibold transition-all items-center gap-2"
                    >
                        Browse Agents
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative z-10">
            <div className="mb-10">
                <p className="data-label text-brand mb-2">Dashboard</p>
                <h1 className="text-5xl font-bold text-white mb-3">My Quests</h1>
                <p className="text-lg text-zinc-500">
                    Track funded quests and view transaction details on the Stacks Explorer.
                </p>
            </div>

            <div className="space-y-3">
                {quests.map((quest, i) => {
                    const config = STATUS_CONFIG[quest.status] || STATUS_CONFIG.pending;
                    return (
                        <div key={i} className="glass-card !p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 scanline-hover">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2.5 mb-1.5">
                                    <h3 className="text-base font-semibold text-white truncate">{quest.agentName}</h3>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${config.classes}`}>
                                        {config.icon} {config.label}
                                    </span>
                                </div>
                                <p className="text-zinc-500 text-sm truncate mb-1">{quest.prompt}</p>
                                <p className="data-label">
                                    {new Date(quest.timestamp).toLocaleString()}
                                </p>
                            </div>

                            <div className="flex items-center gap-5 shrink-0">
                                <div className="text-right">
                                    <span className="data-label">Bounty</span>
                                    <p className="font-bold text-brand text-sm">{quest.bounty} STX</p>
                                </div>
                                <a
                                    href={`https://explorer.hiro.so/txid/${quest.txId}?chain=testnet`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 bg-white/5 hover:bg-white/10 border border-border rounded-lg transition-colors"
                                    title="View on Explorer"
                                >
                                    <ExternalLink size={14} className="text-zinc-500" />
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
