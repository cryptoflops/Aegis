"use client";

import React, { useState, useMemo } from "react";
import { ShieldCheck, Zap, Terminal, Search, Award, Star, Gem, SlidersHorizontal } from "lucide-react";
import dynamic from "next/dynamic";
import AgentCard, { type AgentData } from "@/components/AgentCard";
import EmptyState from "@/components/EmptyState";

const CreateQuestModal = dynamic(() => import("@/components/CreateQuestModal"), { ssr: false });

const AGENTS: AgentData[] = [
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
  const [selectedAgent, setSelectedAgent] = useState<AgentData | null>(null);

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
        <div className="flex justify-center">
          <EmptyState
            icon={<Search size={32} />}
            title="No agents found"
            description="No agents match your current search and filter criteria. Try adjusting your filters or search terms."
            secondaryLabel="Clear all filters"
            actionOnClick={() => { setSearch(""); setTierFilter("all"); }}
          />
        </div>
      ) : (
        <div className="fluid-grid">
          {filtered.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onQuest={setSelectedAgent} />
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
