"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  ShieldCheck,
  Zap,
  Terminal,
  Award,
  Star,
  Gem,
  Coins,
  Check,
  Send,
} from "lucide-react";
import { openContractCall } from "@stacks/connect";
import { getUserSession } from "@/lib/stacks-session";
import { standardPrincipalCV, uintCV, PostConditionMode } from "@stacks/transactions";

const isMainnet = process.env.NEXT_PUBLIC_NETWORK === "mainnet";
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "SP1TN1ERKXEM2H9TKKWGPGZVNVNEKS92M7M3CKVJJ";
const ESCROW_CONTRACT_NAME = "quest-escrow";

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
    icon: <ShieldCheck className="text-emerald-400" size={20} />,
    accentColor: "#34d399",
    stats: { successRate: 99.2, completed: 142 },
  },
  {
    id: 2,
    name: "DeFi Yield Optimizer",
    description: "Monitors Stacks DEXs and lending protocols to execute arbitrage and yield strategies.",
    price: "0.5 STX / Quest",
    priceNum: 0.5,
    tier: "Enterprise",
    tierClass: "tier-enterprise",
    tierIcon: <Gem size={10} />,
    icon: <Zap className="text-amber-400" size={20} />,
    accentColor: "#fbbf24",
    stats: { successRate: 94.5, completed: 89 },
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
    icon: <Terminal className="text-sky-400" size={20} />,
    accentColor: "#38bdf8",
    stats: { successRate: 99.9, completed: 1205 },
  },
];

const STEPS = [
  { num: 1, label: "Select Agent" },
  { num: 2, label: "Define Task" },
  { num: 3, label: "Set Bounty" },
  { num: 4, label: "Confirm" },
];

export default function NewQuestPage() {
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<(typeof AGENTS)[number] | null>(null);
  const [prompt, setPrompt] = useState("");
  const [bounty, setBounty] = useState(0.1);
  const [txId, setTxId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredAgents = AGENTS.filter(
    (a) =>
      search === "" ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedAgent) return;
    const userSession = getUserSession();
    if (!userSession.isUserSignedIn()) {
      setError("Please connect your wallet first.");
      return;
    }

    setSubmitting(true);
    try {
      await openContractCall({
        network: isMainnet ? "mainnet" : "testnet",
        contractAddress: CONTRACT_ADDRESS,
        contractName: ESCROW_CONTRACT_NAME,
        functionName: "create-quest",
        functionArgs: [
          standardPrincipalCV("ST1TN1ERKXEM2H9TKKWGPGZVNVNEKS92M7MAMP23P"),
          uintCV(selectedAgent.id),
          uintCV(bounty * 1000000),
        ],
        postConditionMode: PostConditionMode.Allow,
        appDetails: {
          name: "Aegis",
          icon: window.location.origin + "/favicon.ico",
        },
        onFinish: (data) => {
          setTxId(data.txId);
          const existing = JSON.parse(localStorage.getItem("aegis_quests") || "[]");
          existing.unshift({
            txId: data.txId,
            agentName: selectedAgent.name,
            bounty: bounty,
            prompt: prompt,
            timestamp: Date.now(),
            status: "pending",
          });
          localStorage.setItem("aegis_quests", JSON.stringify(existing));
          setSubmitting(false);
        },
        onCancel: () => {
          console.log("Transaction cancelled");
          setSubmitting(false);
        },
      });
    } catch (error) {
      console.error("Error calling contract:", error);
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!selectedAgent;
      case 2: return prompt.trim().length > 0;
      case 3: return bounty >= (selectedAgent?.priceNum || 0.01);
      default: return true;
    }
  };

  if (txId) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative z-10 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="glass-card max-w-lg w-full p-12 text-center">
          <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-none flex items-center justify-center mx-auto mb-6">
            <Check size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Quest Dispatched!</h1>
          <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
            Transaction broadcasted. The agent will begin execution once funds are locked in escrow.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://explorer.hiro.so/txid/${txId}?chain=${isMainnet ? "mainnet" : "testnet"}`}
              target="_blank"
              rel="noreferrer"
              className="btn-glow inline-flex px-5 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-none font-semibold transition-all active:scale-[0.98] items-center gap-2"
            >
              View on Explorer <Send size={14} />
            </a>
            <Link
              href="/quests"
              className="inline-flex px-5 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 border border-border rounded-none font-medium transition-all active:scale-[0.98] items-center justify-center"
            >
              My Quests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative z-10">
      {/* Header */}
      <Link
        href="/quests"
        className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-sm mb-8"
      >
        <ArrowLeft size={14} /> Back to Quests
      </Link>

      <div className="mb-10">
        <p className="data-label text-brand mb-2">Quest Wizard</p>
        <h1 className="text-5xl font-bold text-white mb-3">Launch a Quest</h1>
        <p className="text-lg text-zinc-500 max-w-2xl">
          Fund an AI agent to execute your task. STX is locked in escrow until the agent produces a verifiable proof.
        </p>
      </div>

      {/* ─── Step Progress ─── */}
      <div className="mb-10">
        <div className="flex items-center gap-0">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 flex items-center justify-center font-[var(--font-mono)] text-xs font-bold border transition-all ${
                    step > s.num
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : step === s.num
                      ? "bg-brand/10 text-brand border-brand/30"
                      : "bg-white/[0.02] text-zinc-600 border-white/10"
                  }`}
                >
                  {step > s.num ? <Check size={14} /> : s.num}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:inline ${
                    step >= s.num ? "text-white" : "text-zinc-600"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 sm:mx-4 ${step > s.num ? "bg-emerald-500/30" : "bg-white/10"}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ─── Step 1: Select Agent ─── */}
      {step === 1 && (
        <div className="animate-fade-up">
          <div className="mb-6">
            <div className="relative max-w-md mb-6">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input
                type="text"
                placeholder="Search agents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {filteredAgents.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-zinc-500 text-sm">No agents match your search.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAgents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`glass-card !p-5 cursor-pointer transition-all active:scale-[0.98] flex items-center gap-4 ${
                    selectedAgent?.id === agent.id
                      ? "!border-brand/40 !bg-brand/[0.03]"
                      : "hover:!border-white/15"
                  }`}
                >
                  <div className="h-10 w-10 shrink-0 rounded-none bg-white/5 border border-border flex items-center justify-center">
                    {agent.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-base font-semibold text-white">{agent.name}</h3>
                      <span className={`tier-badge ${agent.tierClass}`}>
                        {agent.tierIcon}
                        {agent.tier}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-sm truncate">{agent.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-white">{agent.price}</p>
                    <p className="data-label tabular-nums">
                      {agent.stats.successRate}% · {agent.stats.completed} quests
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── Step 2: Define Task ─── */}
      {step === 2 && selectedAgent && (
        <div className="animate-fade-up">
          <div className="glass-card !p-0 overflow-hidden">
            <div className="px-6 sm:px-8 py-5 border-b border-border flex items-center gap-3">
              <div className="h-10 w-10 rounded-none bg-white/5 border border-border flex items-center justify-center">
                {selectedAgent.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{selectedAgent.name}</p>
                <p className="data-label">{selectedAgent.tier} · {selectedAgent.price}</p>
              </div>
            </div>
            <div className="p-6 sm:p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="data-label">Quest Prompt / Instructions</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={`Describe what you want ${selectedAgent.name} to do. Be specific - the agent uses this prompt to execute deterministically.`}
                  className="input-field h-36 resize-none"
                  autoFocus
                />
                <p className="text-zinc-600 text-xs">
                  Example: &quot;Analyze the Clarity contract at SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-marketplace for access-control vulnerabilities and return a JSON report.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Step 3: Set Bounty ─── */}
      {step === 3 && selectedAgent && (
        <div className="animate-fade-up">
          <div className="glass-card !p-0 overflow-hidden">
            <div className="px-6 sm:px-8 py-5 border-b border-border flex items-center gap-3">
              <div className="h-10 w-10 rounded-none bg-white/5 border border-border flex items-center justify-center">
                {selectedAgent.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{selectedAgent.name}</p>
                <p className="data-label">{selectedAgent.tier} · {selectedAgent.price}</p>
              </div>
            </div>
            <div className="p-6 sm:p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="data-label">Bounty Escrow (STX)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Coins size={14} className="text-zinc-600" />
                  </div>
                  <input
                    type="number"
                    min={selectedAgent.priceNum}
                    step="0.01"
                    value={bounty}
                    onChange={(e) => setBounty(Number(e.target.value))}
                    className="input-field !pl-9 text-lg font-bold"
                    autoFocus
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                    <span className="data-label">{isMainnet ? "Mainnet" : "Testnet"}</span>
                  </div>
                </div>
                <p className="data-label mt-1">Minimum bounty: {selectedAgent.price}</p>
              </div>

              {/* Quick amount chips */}
              <div className="flex flex-wrap gap-2">
                {[0.1, 0.5, 1, 5, 10].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setBounty(amt)}
                    className={`filter-chip ${bounty === amt ? "active" : ""}`}
                  >
                    {amt} STX
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Step 4: Review & Confirm ─── */}
      {step === 4 && selectedAgent && (
        <div className="animate-fade-up">
          <div className="glass-card !p-0 overflow-hidden">
            <div className="px-6 sm:px-8 py-5 border-b border-border">
              <h2 className="text-lg font-bold text-white">Quest Summary</h2>
            </div>
            <div className="p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/[0.02] border border-border p-4">
                  <span className="data-label">Agent</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-6 w-6 rounded-none bg-white/5 border border-border flex items-center justify-center">
                      {selectedAgent.icon}
                    </div>
                    <p className="text-white font-semibold text-sm">{selectedAgent.name}</p>
                  </div>
                </div>
                <div className="bg-white/[0.02] border border-border p-4">
                  <span className="data-label">Bounty</span>
                  <p className="text-brand font-bold text-lg mt-1">{bounty} STX</p>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-border p-4">
                <span className="data-label">Task Description</span>
                <p className="text-zinc-300 text-sm mt-1 leading-relaxed">{prompt}</p>
              </div>

              <div className="bg-amber-500/[0.04] border border-amber-500/15 p-4">
                <p className="text-xs text-amber-400/80 leading-relaxed">
                  <strong>Important:</strong> Your STX will be locked in the escrow smart contract. Funds are only released when the evaluator oracle cryptographically verifies the agent&apos;s execution trace. This process is trustless and on-chain.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Navigation Buttons ─── */}
      {error && (
        <div className="mt-6 bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => { setStep(Math.max(1, step - 1)); setError(null); }}
          disabled={step === 1}
          className="px-5 py-3 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-none font-medium transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {step < 4 ? (
          <button
            onClick={() => { setStep(step + 1); setError(null); }}
            disabled={!canProceed()}
            className="btn-glow px-6 py-3 bg-brand hover:bg-brand-hover disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-none font-semibold transition-all active:scale-[0.98] flex items-center gap-2"
          >
            Continue <ArrowRight size={14} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-glow px-6 py-3 bg-brand hover:bg-brand-hover disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-none font-semibold transition-all active:scale-[0.98] flex items-center gap-2"
          >
            {submitting ? (
              <>Processing…</>
            ) : (
              <>
                <Send size={14} /> Lock Funds & Dispatch Quest
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
