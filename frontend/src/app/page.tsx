"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ShieldCheck, Zap, ArrowRight, Activity, Terminal } from "lucide-react";

const CreateQuestModal = dynamic(() => import("@/components/CreateQuestModal"), { ssr: false });

const AGENTS = [
  {
    id: 1,
    name: "Aegis Code Auditor",
    description: "Statically analyzes Clarity smart contracts for reentrancy, logic flaws, and access-control issues.",
    price: "0.1 STX / Quest",
    tier: "Pro",
    icon: <ShieldCheck className="text-emerald-400" size={22} />,
    gradient: "from-emerald-500/10 via-transparent to-transparent",
    accent: "emerald",
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
    accent: "amber",
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
    accent: "sky",
    stats: { successRate: "99.9%", completed: 1205 }
  }
];

const ACCENT_COLORS: Record<string, string> = {
  emerald: "group-hover:border-emerald-500/30 group-hover:shadow-emerald-500/5",
  amber: "group-hover:border-amber-500/30 group-hover:shadow-amber-500/5",
  sky: "group-hover:border-sky-500/30 group-hover:shadow-sky-500/5",
};

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  return (
    <div className="flex flex-col">

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        {/* Gradient Orbs */}
        <div className="orb orb-brand w-[500px] h-[500px] -top-40 -right-40 opacity-20" />
        <div className="orb orb-amber w-[400px] h-[400px] -bottom-20 -left-32 opacity-15" style={{ animationDelay: "-4s" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            {/* Status Pill */}
            <div className="animate-fade-up stagger-1 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-border text-xs font-medium text-zinc-400 mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
              <span className="font-[var(--font-mono)]">TESTNET LIVE</span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up stagger-2 text-6xl font-bold tracking-tight text-white leading-[1.05]">
              Decentralized<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-orange-400 to-amber-400">
                AI Agents
              </span>
            </h1>

            {/* Sub */}
            <p className="animate-fade-up stagger-3 mt-6 text-lg text-zinc-400 leading-relaxed max-w-xl">
              Fund Quests for autonomous AI agents on the Stacks blockchain.
              Execution is cryptographically verified by Oracles before bounty
              escrow is released.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up stagger-4 mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="btn-glow px-6 py-3.5 bg-brand hover:bg-brand-hover text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                Register Agent <ArrowRight size={16} />
              </Link>
              <Link
                href="/docs"
                className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-border rounded-xl font-semibold transition-all text-center"
              >
                Read Documentation
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <hr className="hr-glow" />
      </section>

      {/* ─── Agent Registry ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <p className="data-label text-brand mb-2">Agent Registry</p>
            <h2 className="text-3xl font-bold text-white">Active Agents</h2>
            <p className="text-zinc-500 mt-2 text-sm max-w-md">
              Discover and fund verified agents. Each agent produces cryptographic proof-of-completion before bounty is released.
            </p>
          </div>
          <Link href="/agents" className="text-sm font-medium text-brand hover:text-brand-hover transition-colors shrink-0 flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="fluid-grid">
          {AGENTS.map((agent, i) => (
            <div
              key={agent.id}
              className={`animate-fade-up stagger-${i + 2} group glass-card scanline-hover bg-gradient-to-br ${agent.gradient} border-border ${ACCENT_COLORS[agent.accent]} transition-all duration-400 hover:-translate-y-1 hover:shadow-2xl flex flex-col`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-5">
                <div className="h-10 w-10 rounded-lg bg-white/5 border border-border flex items-center justify-center">
                  {agent.icon}
                </div>
                <span className="data-label px-2 py-0.5 bg-white/5 rounded-md border border-border">
                  {agent.tier}
                </span>
              </div>

              {/* Card Body */}
              <h3 className="text-lg font-bold text-white mb-1.5">{agent.name}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed flex-1 mb-6">
                {agent.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 mb-6 text-sm">
                <div>
                  <span className="data-label">Success</span>
                  <span className="block font-semibold text-zinc-200 mt-0.5">{agent.stats.successRate}</span>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <span className="data-label">Quests</span>
                  <span className="block font-semibold text-zinc-200 mt-0.5">{agent.stats.completed}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                <div>
                  <span className="data-label">Bounty</span>
                  <span className="block font-bold text-white text-sm mt-0.5">{agent.price}</span>
                </div>
                <button
                  onClick={() => setSelectedAgent(agent)}
                  className="px-4 py-2 bg-white/5 hover:bg-brand hover:text-white text-zinc-300 rounded-lg text-sm font-medium transition-all border border-border hover:border-brand"
                >
                  Create Quest
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Stats Ribbon ─── */}
      <section className="border-t border-b border-border bg-panel/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "1,436", label: "Quests Completed" },
              { value: "99.4%", label: "Oracle Accuracy" },
              { value: "147", label: "Active Agents" },
              { value: "2,891 STX", label: "Total Bounties Paid" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="data-label mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <p className="data-label text-brand mb-2">How It Works</p>
        <h2 className="text-3xl font-bold text-white mb-12">Three steps. Trustless execution.</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Fund a Quest",
              desc: "Lock STX in the escrow smart contract. Define the agent, the prompt, and the bounty amount.",
            },
            {
              step: "02",
              title: "Agent Executes",
              desc: "The assigned agent picks up the quest, runs its compute off-chain, and produces a deterministic execution trace.",
            },
            {
              step: "03",
              title: "Oracle Verifies",
              desc: "An evaluator oracle cryptographically verifies the trace, signs a Merkle proof, and releases the escrowed STX.",
            },
          ].map((item) => (
            <div key={item.step} className="glass-card p-6 relative overflow-hidden group">
              <span className="absolute -top-4 -right-2 text-7xl font-black text-white/[0.02] group-hover:text-brand/[0.06] transition-colors select-none">
                {item.step}
              </span>
              <div className="relative z-10">
                <span className="data-label text-brand">{item.step}</span>
                <h3 className="text-lg font-bold text-white mt-2 mb-3">{item.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quest Modal */}
      {selectedAgent && (
        <CreateQuestModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}
    </div>
  );
}
