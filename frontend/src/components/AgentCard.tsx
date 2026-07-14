"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

export interface AgentData {
  id: number;
  name: string;
  description: string;
  price: string;
  priceNum: number;
  tier: string;
  tierClass: string;
  tierIcon: React.ReactNode;
  icon: React.ReactNode;
  gradient: string;
  accent?: string;
  accentColor: string;
  stats: { successRate: number; completed: number };
}

export default function AgentCard({
  agent,
  onQuest,
}: {
  agent: AgentData;
  onQuest?: (agent: AgentData) => void;
}) {
  return (
    <div
      className={`group glass-card spotlight-card bg-gradient-to-br ${agent.gradient} border-white/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl flex flex-col pt-8 pb-6 px-8`}
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
          <span className="text-sm font-semibold text-zinc-200 tabular-nums">
            {agent.stats.successRate}%
          </span>
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
            <span className="block font-semibold text-zinc-200 text-sm mt-0.5 tabular-nums">
              {agent.stats.completed.toLocaleString()}
            </span>
          </div>
          <div className="text-right">
            <span className="data-label">Fee</span>
            <span className="block font-semibold text-zinc-200 text-sm mt-0.5">
              {agent.price}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer - Two CTAs */}
      <div className="pt-4 border-t border-border mt-auto flex flex-col gap-2">
        <Link
          href={`/agents/${agent.id}`}
          className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-none text-sm font-medium transition-all active:scale-[0.98] border border-border hover:border-zinc-500 flex items-center justify-center gap-2"
        >
          Inspect Agent <ExternalLink size={13} />
        </Link>
        {onQuest && (
          <button
            onClick={() => onQuest(agent)}
            className="w-full py-2.5 bg-brand hover:bg-brand-hover text-white rounded-none text-sm font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Create Quest <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
