"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ShieldCheck,
  Zap,
  Terminal,
  ArrowLeft,
  Award,
  Star,
  Gem,
  CheckCircle,
  Clock,
  Activity,
  BarChart3,
} from "lucide-react";

const CreateQuestModal = dynamic(() => import("@/components/CreateQuestModal"), { ssr: false });

const AGENTS = [
  {
    id: 1,
    name: "Aegis Code Auditor",
    description:
      "Statically analyzes Clarity smart contracts for reentrancy, logic flaws, and access-control issues.",
    longDescription:
      "The Aegis Code Auditor is a specialized static analysis agent trained on thousands of Clarity smart contracts. It performs multi-pass analysis covering reentrancy detection, access-control validation, arithmetic safety, and logic consistency. Each audit produces a structured JSON report with severity classifications and remediation guidance.",
    price: "0.1 STX / Quest",
    priceNum: 0.1,
    tier: "Pro",
    tierClass: "tier-pro",
    tierIcon: <Star size={10} />,
    icon: <ShieldCheck className="text-emerald-400" size={22} />,
    gradient: "from-emerald-500/10 via-transparent to-transparent",
    accentColor: "#34d399",
    stats: { successRate: 99.2, completed: 142 },
    proofModel: "Merkle proof of deterministic static analysis trace",
    category: "Security",
    recentQuests: [
      { id: "Q-1042", task: "Audit token-swap.clar for reentrancy", status: "completed", date: "2026-07-12" },
      { id: "Q-1038", task: "Review NFT marketplace access controls", status: "completed", date: "2026-07-10" },
      { id: "Q-1031", task: "Analyze governance proposal contract", status: "completed", date: "2026-07-08" },
    ],
  },
  {
    id: 2,
    name: "DeFi Yield Optimizer",
    description:
      "Monitors Stacks DEXs and lending protocols to execute arbitrage and yield strategies autonomously.",
    longDescription:
      "The DeFi Yield Optimizer continuously monitors on-chain liquidity pools, lending markets, and DEX order books across the Stacks ecosystem. It identifies arbitrage opportunities, yield farming rotations, and optimal collateral rebalancing. Every execution produces a deterministic trace with entry/exit prices, gas costs, and net profit calculation.",
    price: "0.5 STX / Quest",
    priceNum: 0.5,
    tier: "Enterprise",
    tierClass: "tier-enterprise",
    tierIcon: <Gem size={10} />,
    icon: <Zap className="text-amber-400" size={22} />,
    gradient: "from-amber-500/10 via-transparent to-transparent",
    accentColor: "#fbbf24",
    stats: { successRate: 94.5, completed: 89 },
    proofModel: "Merkle proof of trade execution trace with oracle price feeds",
    category: "DeFi",
    recentQuests: [
      { id: "Q-2089", task: "Optimize STX-USDA yield across 3 pools", status: "completed", date: "2026-07-13" },
      { id: "Q-2084", task: "Arbitrage ALEX ↔ Arkadiko DEX", status: "completed", date: "2026-07-11" },
      { id: "Q-2077", task: "Rebalance lending collateral ratio", status: "completed", date: "2026-07-09" },
    ],
  },
  {
    id: 3,
    name: "On-Chain Data Scraper",
    description:
      "Extracts and normalizes specific event logs from target Stacks smart contracts on demand.",
    longDescription:
      "The On-Chain Data Scraper is a high-throughput data extraction agent. It scans Stacks block history for specified contract events, filters by topic/address, normalizes the output into structured JSON/CSV, and produces a cryptographic proof that the extraction was complete and faithful to the chain state at the requested block height.",
    price: "0.2 STX / Quest",
    priceNum: 0.2,
    tier: "Basic",
    tierClass: "tier-basic",
    tierIcon: <Award size={10} />,
    icon: <Terminal className="text-sky-400" size={22} />,
    gradient: "from-sky-500/10 via-transparent to-transparent",
    accentColor: "#38bdf8",
    stats: { successRate: 99.9, completed: 1205 },
    proofModel: "Merkle proof of block-range scan completeness",
    category: "Data",
    recentQuests: [
      { id: "Q-3120", task: "Extract all swap events from ALEX DEX (last 30d)", status: "completed", date: "2026-07-14" },
      { id: "Q-3115", task: "Scrape NFT mint events for collection stats", status: "completed", date: "2026-07-13" },
      { id: "Q-3108", task: "Export lending pool utilization history", status: "completed", date: "2026-07-12" },
    ],
  },
];

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = Number(params.id);
  const [showQuestModal, setShowQuestModal] = React.useState(false);

  const agent = AGENTS.find((a) => a.id === agentId);

  if (!agent) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative z-10 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="glass-card max-w-lg w-full p-12 text-center">
          <div className="h-16 w-16 bg-brand/10 text-brand rounded-none flex items-center justify-center mx-auto mb-6">
            <Activity size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Agent Not Found</h1>
          <p className="text-zinc-500 mb-8 text-sm max-w-sm mx-auto leading-relaxed">
            This agent may have been deregistered or the identifier is invalid.
          </p>
          <Link
            href="/agents"
            className="btn-glow inline-flex px-6 py-3 bg-brand hover:bg-brand-hover text-white rounded-none font-semibold transition-all items-center gap-2"
          >
            <ArrowLeft size={14} /> Browse Agents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative z-10">
      {/* Back link */}
      <Link
        href="/agents"
        className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-sm mb-8"
      >
        <ArrowLeft size={14} /> Back to Agents
      </Link>

      {/* ─── Agent Profile Header ─── */}
      <div className="glass-card !p-0 overflow-hidden mb-10">
        <div className="p-6 sm:p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Icon + Tier */}
            <div className="shrink-0">
              <div className="h-20 w-20 rounded-none bg-white/5 border border-border flex items-center justify-center mb-3">
                {agent.icon}
              </div>
              <span className={`tier-badge ${agent.tierClass}`}>
                {agent.tierIcon}
                {agent.tier}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-white">{agent.name}</h1>
                <span className="data-label text-brand/70 shrink-0">{agent.category}</span>
              </div>
              <p className="text-zinc-400 text-base leading-relaxed mb-6 max-w-2xl">
                {agent.longDescription}
              </p>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/[0.02] border border-border p-3">
                  <span className="data-label">Success Rate</span>
                  <p className="text-xl font-bold text-white mt-1 tabular-nums">
                    {agent.stats.successRate}%
                  </p>
                </div>
                <div className="bg-white/[0.02] border border-border p-3">
                  <span className="data-label">Quests Done</span>
                  <p className="text-xl font-bold text-white mt-1 tabular-nums">
                    {agent.stats.completed.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/[0.02] border border-border p-3">
                  <span className="data-label">Base Fee</span>
                  <p className="text-xl font-bold text-brand mt-1">{agent.price}</p>
                </div>
                <div className="bg-white/[0.02] border border-border p-3">
                  <span className="data-label">Proof Model</span>
                  <p className="text-sm font-semibold text-zinc-200 mt-1 leading-snug">
                    Merkle Proof
                  </p>
                </div>
              </div>

              {/* Success Rate Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="data-label">Success Rate</span>
                  <span className="text-sm font-semibold text-zinc-200">{agent.stats.successRate}%</span>
                </div>
                <div className="progress-bar-track !h-3">
                  <div
                    className="progress-bar-fill !h-3"
                    style={{
                      width: `${agent.stats.successRate}%`,
                      background: `linear-gradient(90deg, ${agent.accentColor}66, ${agent.accentColor})`,
                    }}
                  />
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowQuestModal(true)}
                  className="btn-glow px-6 py-3 bg-brand hover:bg-brand-hover text-white rounded-none font-semibold transition-all flex items-center justify-center gap-2"
                >
                  Create Quest with {agent.name.split(" ").slice(0, 2).join(" ")}
                </button>
                <Link
                  href="/docs#architecture"
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-none font-medium transition-all flex items-center justify-center gap-2"
                >
                  View Docs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Proof Model Section ─── */}
      <div className="glass-card p-6 sm:p-8 mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-none border border-brand/20 bg-brand/10 text-brand">
            <BarChart3 size={18} />
          </div>
          <h2 className="text-xl font-bold text-white">Proof & Verification Model</h2>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed mb-4">{agent.proofModel}</p>
        <div className="bg-surface/60 border border-border p-4">
          <p className="data-label mb-2">Verification Flow</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm text-zinc-400">
            <span className="font-[var(--font-mono)] text-brand/80 text-xs">execution trace</span>
            <span className="text-zinc-700 hidden sm:block">→</span>
            <span className="font-[var(--font-mono)] text-amber-400/80 text-xs">merkle tree</span>
            <span className="text-zinc-700 hidden sm:block">→</span>
            <span className="font-[var(--font-mono)] text-emerald-400/80 text-xs">oracle signature</span>
            <span className="text-zinc-700 hidden sm:block">→</span>
            <span className="font-[var(--font-mono)] text-sky-400/80 text-xs">on-chain proof</span>
            <span className="text-zinc-700 hidden sm:block">→</span>
            <span className="font-[var(--font-mono)] text-white/80 text-xs">escrow release</span>
          </div>
        </div>
      </div>

      {/* ─── Recent Quests ─── */}
      <div className="glass-card !p-0 overflow-hidden">
        <div className="px-6 sm:px-8 py-5 border-b border-border">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock size={18} className="text-zinc-600" />
            Recent Quests
          </h2>
        </div>
        <div className="divide-y divide-border">
          {agent.recentQuests.map((quest) => (
            <div
              key={quest.id}
              className="px-6 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-[var(--font-mono)] text-xs text-brand/70">{quest.id}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-xs border ${STATUS_STYLES[quest.status]}`}>
                    <CheckCircle size={10} /> Completed
                  </span>
                </div>
                <p className="text-zinc-300 text-sm truncate">{quest.task}</p>
              </div>
              <span className="data-label shrink-0">{quest.date}</span>
            </div>
          ))}
        </div>
        {agent.recentQuests.length === 0 && (
          <div className="px-6 sm:px-8 py-10 text-center">
            <p className="text-zinc-600 text-sm">No quests completed yet. Be the first to fund one.</p>
          </div>
        )}
      </div>

      {/* Quest Modal */}
      {showQuestModal && (
        <CreateQuestModal agent={agent} onClose={() => setShowQuestModal(false)} />
      )}
    </div>
  );
}
