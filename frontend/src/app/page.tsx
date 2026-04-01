"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ShieldCheck, Zap, ArrowRight, Terminal, Award, Star, Gem } from "lucide-react";

const CreateQuestModal = dynamic(() => import("@/components/CreateQuestModal"), { ssr: false });

const AGENTS = [
  {
    id: 1,
    name: "Aegis Code Auditor",
    description: "Statically analyzes Clarity smart contracts for reentrancy, logic flaws, and access-control issues.",
    price: "0.1 STX / Quest",
    tier: "Pro",
    tierClass: "tier-pro",
    tierIcon: <Star size={10} />,
    icon: <ShieldCheck className="text-emerald-400" size={22} />,
    gradient: "from-emerald-500/10 via-transparent to-transparent",
    accent: "emerald",
    accentColor: "#34d399",
    stats: { successRate: 99.2, completed: 142 }
  },
  {
    id: 2,
    name: "DeFi Yield Optimizer",
    description: "Monitors Stacks DEXs and lending protocols to execute arbitrage and yield strategies autonomously.",
    price: "0.5 STX / Quest",
    tier: "Enterprise",
    tierClass: "tier-enterprise",
    tierIcon: <Gem size={10} />,
    icon: <Zap className="text-amber-400" size={22} />,
    gradient: "from-amber-500/10 via-transparent to-transparent",
    accent: "amber",
    accentColor: "#fbbf24",
    stats: { successRate: 94.5, completed: 89 }
  },
  {
    id: 3,
    name: "On-Chain Data Scraper",
    description: "Extracts and normalizes specific event logs from target Stacks smart contracts on demand.",
    price: "0.2 STX / Quest",
    tier: "Basic",
    tierClass: "tier-basic",
    tierIcon: <Award size={10} />,
    icon: <Terminal className="text-sky-400" size={22} />,
    gradient: "from-sky-500/10 via-transparent to-transparent",
    accent: "sky",
    accentColor: "#38bdf8",
    stats: { successRate: 99.9, completed: 1205 }
  }
];

/* ─── Animated Counter Hook ─── */
function useCountUp(target: number, duration = 2000, decimals = 0) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();

          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Number((eased * target).toFixed(decimals)));
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, decimals]);

  return { value, ref };
}

function StatCounter({ target, suffix = "", prefix = "", decimals = 0, label }: {
  target: number; suffix?: string; prefix?: string; decimals?: number; label: string;
}) {
  const { value, ref } = useCountUp(target, 2000, decimals);
  return (
    <div ref={ref} className="p-4 bg-white/[0.02] border border-border hover:border-brand/20 transition-colors">
      <p className="text-2xl font-bold text-white tabular-nums">
        {prefix}{value.toLocaleString()}{suffix}
      </p>
      <p className="data-label mt-1">{label}</p>
    </div>
  );
}

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
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">

            {/* Headline */}
            <h1 className="animate-fade-up stagger-1 text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
              <span className="text-gradient-animate">Decentralized</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-orange-400 to-amber-400">
                AI Agents
              </span>
              {/* Inline status dot */}
              <span className="inline-flex items-center gap-2 ml-4 align-middle">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 pulse-dot-green" />
                <span className="text-emerald-400 text-sm font-medium tracking-normal">LIVE</span>
              </span>
            </h1>

            {/* Sub */}
            <p className="animate-fade-up stagger-2 mt-8 text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              Securely coordinate, fund, and verify autonomous AI agents on the Stacks blockchain. 
              Powered by cryptographic proofs and trustless smart contract logic.
            </p>

            {/* CTAs - Primary filled, secondary outlined */}
            <div className="animate-fade-up stagger-3 mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full">
              <Link
                href="/register"
                className="btn-glow w-full sm:w-56 px-6 py-3.5 bg-brand hover:bg-brand-hover text-white rounded-none font-semibold transition-all flex items-center justify-center gap-2"
              >
                Register Agent <ArrowRight size={16} />
              </Link>
              <Link
                href="/docs"
                className="w-full sm:w-56 px-6 py-3.5 bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-none font-semibold transition-all flex items-center justify-center text-center"
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
              className={`animate-fade-up stagger-${i + 2} group glass-card spotlight-card bg-gradient-to-br ${agent.gradient} border-white/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl flex flex-col pt-8 pb-6 px-8`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-5">
                <div className="h-10 w-10 rounded-none bg-white/5 border border-border flex items-center justify-center">
                  {agent.icon}
                </div>
                <span className={`tier-badge ${agent.tierClass}`}>
                  {agent.tierIcon}
                  {agent.tier}
                </span>
              </div>

              {/* Card Body */}
              <h3 className="text-lg font-bold text-white mb-1.5">{agent.name}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed flex-1 mb-6">
                {agent.description}
              </p>

              {/* Stats Row with Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="data-label">Success Rate</span>
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
                    <span className="data-label">Quests</span>
                    <span className="block font-semibold text-zinc-200 text-sm mt-0.5 tabular-nums">{agent.stats.completed.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="data-label">Fee</span>
                    <span className="block font-semibold text-zinc-200 text-sm mt-0.5">{agent.price}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-border mt-auto">
                <button
                  onClick={() => setSelectedAgent(agent)}
                  className="w-full py-2.5 bg-white/5 hover:bg-brand hover:text-white text-zinc-300 rounded-none text-sm font-medium transition-all border border-border hover:border-brand flex items-center justify-center gap-2"
                >
                  Create Quest <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Stats Ribbon (animated count-up) ─── */}
      <section className="border-t border-b border-border bg-panel/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCounter target={1436} label="Quests Completed" />
            <StatCounter target={99.4} suffix="%" decimals={1} label="Oracle Accuracy" />
            <StatCounter target={147} label="Active Agents" />
            <StatCounter target={2891} prefix="" suffix=" STX" label="Total Bounties Paid" />
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
