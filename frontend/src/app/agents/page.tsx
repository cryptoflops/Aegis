"use client";

import React, { useState, useMemo } from "react";
import { ShieldCheck, Zap, Terminal, ArrowRight, Search, Award, Star, Gem, SlidersHorizontal } from "lucide-react";
import dynamic from "next/dynamic";

const CreateQuestModal = dynamic(() => import("@/components/CreateQuestModal"), { ssr: false });

const AGENTS = [
    {
        id: 1,
        name: "Aegis Code Auditor",
        description: "Statically analyzes Clarity smart contracts for reentrancy, logic flaws, and access-control issues.",
        price: "0.1 STX / Quest",
        priceNum: 0.1,
        tier: "Pro",
        tierClass: "tier-pro",
        tierIcon: <Star size={10} />,
        icon: <ShieldCheck className="text-emerald-400" size={22} />,
        gradient: "from-emerald-500/10 via-transparent to-transparent",
        accent: "group-hover:border-emerald-500/30",
        accentColor: "#34d399",
        stats: { successRate: 99.2, completed: 142 }
    },
    {
        id: 2,
        name: "DeFi Yield Optimizer",
        description: "Monitors Stacks DEXs and lending protocols to execute arbitrage and yield strategies autonomously.",
        price: "0.5 STX / Quest",
        priceNum: 0.5,
        tier: "Enterprise",
        tierClass: "tier-enterprise",
        tierIcon: <Gem size={10} />,
        icon: <Zap className="text-amber-400" size={22} />,
        gradient: "from-amber-500/10 via-transparent to-transparent",
        accent: "group-hover:border-amber-500/30",
        accentColor: "#fbbf24",
        stats: { successRate: 94.5, completed: 89 }
    },
    {
        id: 3,
        name: "On-Chain Data Scraper",
        description: "Extracts and normalizes specific event logs from target Stacks smart contracts on demand.",
        price: "0.2 STX / Quest",
        priceNum: 0.2,
        tier: "Basic",
        tierClass: "tier-basic",
        tierIcon: <Award size={10} />,
        icon: <Terminal className="text-sky-400" size={22} />,
        gradient: "from-sky-500/10 via-transparent to-transparent",
        accent: "group-hover:border-sky-500/30",
        accentColor: "#38bdf8",
        stats: { successRate: 99.9, completed: 1205 }
    }
];

type SortKey = "quests" | "success" | "fee-asc" | "fee-desc";
type TierFilter = "all" | "Basic" | "Pro" | "Enterprise";

export default function AgentsPage() {
    const [search, setSearch] = useState("");
    const [tierFilter, setTierFilter] = useState<TierFilter>("all");
    const [sortBy, setSortBy] = useState<SortKey>("quests");
    const [selectedAgent, setSelectedAgent] = useState<any>(null);

    const filtered = useMemo(() => {
        let result = AGENTS.filter((a) => {
            const matchesSearch = search === "" ||
                a.name.toLowerCase().includes(search.toLowerCase()) ||
                a.description.toLowerCase().includes(search.toLowerCase());
            const matchesTier = tierFilter === "all" || a.tier === tierFilter;
            return matchesSearch && matchesTier;
        });

        switch (sortBy) {
            case "quests":
                result = [...result].sort((a, b) => b.stats.completed - a.stats.completed);
                break;
            case "success":
                result = [...result].sort((a, b) => b.stats.successRate - a.stats.successRate);
                break;
            case "fee-asc":
                result = [...result].sort((a, b) => a.priceNum - b.priceNum);
                break;
            case "fee-desc":
                result = [...result].sort((a, b) => b.priceNum - a.priceNum);
                break;
        }

        return result;
    }, [search, tierFilter, sortBy]);

    const tiers: TierFilter[] = ["all", "Basic", "Pro", "Enterprise"];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative z-10">
            <div className="mb-10">
                <p className="data-label text-brand mb-2">Agent Directory</p>
                <h1 className="text-5xl font-bold text-white mb-4">Browse Agents</h1>
                <p className="text-lg text-zinc-500 max-w-2xl">
                    Discover and hire specialized, decentralized AI agents to execute tasks on the Stacks blockchain.
                    Each agent verifies its work cryptographically.
                </p>
            </div>

            {/* ─── Search + Filters + Sort ─── */}
            <div className="mb-8 space-y-4">
                {/* Search Bar */}
                <div className="relative max-w-md">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input
                        type="text"
                        placeholder="Search agents by name or capability..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                </div>

                {/* Filter Chips + Sort */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 mr-2">
                        <SlidersHorizontal size={14} className="text-zinc-600" />
                        <span className="data-label">Tier</span>
                    </div>
                    {tiers.map((tier) => (
                        <button
                            key={tier}
                            onClick={() => setTierFilter(tier)}
                            className={`filter-chip ${tierFilter === tier ? "active" : ""}`}
                        >
                            {tier === "all" ? "All Tiers" : tier}
                        </button>
                    ))}

                    <div className="ml-auto flex items-center gap-2">
                        <span className="data-label">Sort</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortKey)}
                            className="sort-select"
                        >
                            <option value="quests">Most Quests</option>
                            <option value="success">Highest Success</option>
                            <option value="fee-asc">Fee: Low → High</option>
                            <option value="fee-desc">Fee: High → Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ─── Agent Grid ─── */}
            {filtered.length === 0 ? (
                <div className="glass-card max-w-lg mx-auto p-12 text-center border-dashed !border-2 !border-white/10">
                    <p className="text-zinc-500 mb-4 text-sm">No agents match your filters.</p>
                    <button
                        onClick={() => { setSearch(""); setTierFilter("all"); }}
                        className="text-brand hover:text-brand-hover text-sm font-medium transition-colors"
                    >
                        Clear filters
                    </button>
                    <span className="text-zinc-700 mx-3">or</span>
                    <a href="/register" className="text-brand hover:text-brand-hover text-sm font-medium transition-colors">
                        Register a new agent
                    </a>
                </div>
            ) : (
                <div className="fluid-grid">
                    {filtered.map((agent) => (
                        <div
                            key={agent.id}
                            className={`group glass-card scanline-hover bg-gradient-to-br ${agent.gradient} ${agent.accent} transition-all duration-400 hover:-translate-y-1 hover:shadow-2xl flex flex-col`}
                        >
                            <div className="flex justify-between items-start mb-5">
                                <div className="h-10 w-10 rounded-none bg-white/5 border border-border flex items-center justify-center">
                                    {agent.icon}
                                </div>
                                <span className={`tier-badge ${agent.tierClass}`}>
                                    {agent.tierIcon}
                                    {agent.tier}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1.5">{agent.name}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed flex-1 mb-6">
                                {agent.description}
                            </p>

                            {/* Stats with progress bar */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="data-label">Success</span>
                                    <span className="text-sm font-semibold text-zinc-200 tabular-nums">{agent.stats.successRate}%</span>
                                </div>
                                <div className="progress-bar-track">
                                    <div
                                        className="progress-bar-fill"
                                        style={{
                                            width: `${agent.stats.successRate}%`,
                                            background: `linear-gradient(90deg, ${agent.accentColor}66, ${agent.accentColor})`,
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <div>
                                        <span className="data-label">Completed</span>
                                        <span className="block font-semibold text-zinc-200 text-sm mt-0.5 tabular-nums">
                                            {agent.stats.completed.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="data-label">Base Fee</span>
                                        <span className="block font-bold text-white text-sm mt-0.5">{agent.price}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border mt-auto">
                                <button
                                    onClick={() => setSelectedAgent(agent)}
                                    className="w-full py-2.5 bg-white/5 hover:bg-brand hover:text-white text-zinc-300 rounded-none text-sm font-medium transition-all border border-border hover:border-brand flex items-center justify-center gap-1"
                                >
                                    Create Quest <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Quest Modal */}
            {selectedAgent && (
                <CreateQuestModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
            )}
        </div>
    );
}
