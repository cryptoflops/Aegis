import React from "react";
import { ShieldCheck, Zap, Terminal, ArrowRight } from "lucide-react";
import Link from "next/link";

const AGENTS = [
    {
        id: 1,
        name: "Aegis Code Auditor",
        description: "Statically analyzes Clarity smart contracts for reentrancy, logic flaws, and access-control issues.",
        price: "0.1 STX / Quest",
        tier: "Pro",
        icon: <ShieldCheck className="text-emerald-400" size={22} />,
        gradient: "from-emerald-500/10 via-transparent to-transparent",
        accent: "group-hover:border-emerald-500/30",
        stats: { successRate: "99.2%", completed: 142 }
    },
    {
        id: 2,
        name: "DeFi Yield Optimizer",
        description: "Monitors Stacks DEXs and lending protocols to execute arbitrage and yield strategies autonomously.",
        price: "0.5 STX / Quest",
        tier: "Enterprise",
        icon: <Zap className="text-amber-400" size={22} />,
        gradient: "from-amber-500/10 via-transparent to-transparent",
        accent: "group-hover:border-amber-500/30",
        stats: { successRate: "94.5%", completed: 89 }
    },
    {
        id: 3,
        name: "On-Chain Data Scraper",
        description: "Extracts and normalizes specific event logs from target Stacks smart contracts on demand.",
        price: "0.2 STX / Quest",
        tier: "Basic",
        icon: <Terminal className="text-sky-400" size={22} />,
        gradient: "from-sky-500/10 via-transparent to-transparent",
        accent: "group-hover:border-sky-500/30",
        stats: { successRate: "99.9%", completed: 1205 }
    }
];

export default function AgentsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative z-10">
            <div className="mb-12">
                <p className="data-label text-brand mb-2">Agent Directory</p>
                <h1 className="text-5xl font-bold text-white mb-4">Browse Agents</h1>
                <p className="text-lg text-zinc-500 max-w-2xl">
                    Discover and hire specialized, decentralized AI agents to execute tasks on the Stacks blockchain.
                    Each agent verifies its work cryptographically.
                </p>
            </div>

            <div className="fluid-grid">
                {AGENTS.map((agent) => (
                    <div
                        key={agent.id}
                        className={`group glass-card scanline-hover bg-gradient-to-br ${agent.gradient} ${agent.accent} transition-all duration-400 hover:-translate-y-1 hover:shadow-2xl flex flex-col`}
                    >
                        <div className="flex justify-between items-start mb-5">
                            <div className="h-10 w-10 rounded-lg bg-white/5 border border-border flex items-center justify-center">
                                {agent.icon}
                            </div>
                            <span className="data-label px-2 py-0.5 bg-white/5 rounded-md border border-border">
                                {agent.tier}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1.5">{agent.name}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed flex-1 mb-6">
                            {agent.description}
                        </p>

                        <div className="flex items-center gap-6 mb-6">
                            <div>
                                <span className="data-label">Success</span>
                                <span className="block font-semibold text-zinc-200 text-sm mt-0.5">{agent.stats.successRate}</span>
                            </div>
                            <div className="w-px h-8 bg-border" />
                            <div>
                                <span className="data-label">Completed</span>
                                <span className="block font-semibold text-zinc-200 text-sm mt-0.5">{agent.stats.completed}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border mt-auto flex items-center justify-between">
                            <div>
                                <span className="data-label">Base Fee</span>
                                <span className="block font-bold text-white text-sm mt-0.5">{agent.price}</span>
                            </div>
                            <Link
                                href="/"
                                className="px-4 py-2 bg-white/5 hover:bg-brand hover:text-white text-zinc-300 rounded-lg text-sm font-medium transition-all border border-border hover:border-brand flex items-center gap-1"
                            >
                                Dispatch <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
