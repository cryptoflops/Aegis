"use client";

import React, { useState, useEffect, useRef } from "react";

interface Stat {
  label: string;
  value: number | null;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

interface ProtocolStatsProps {
  stats?: Stat[];
}

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

function StatWithData({ stat }: { stat: Stat }) {
  const { value, ref } = useCountUp(stat.value!, 2000, stat.decimals ?? 0);

  return (
    <div
      ref={ref}
      className="p-4 bg-white/[0.02] border border-border hover:border-brand/20 transition-colors"
    >
      <p className="text-2xl font-bold text-white tabular-nums">
        {stat.prefix ?? ""}
        {value.toLocaleString()}
        {stat.suffix ?? ""}
      </p>
      <p className="data-label mt-1">{stat.label}</p>
    </div>
  );
}

function StatEmpty({ stat }: { stat: Stat }) {
  return (
    <div className="p-4 bg-white/[0.02] border border-border hover:border-brand/20 transition-colors">
      <p className="text-sm text-zinc-600 font-medium">-</p>
      <p className="data-label mt-1">{stat.label}</p>
    </div>
  );
}

function StatCell({ stat }: { stat: Stat }) {
  const hasData = stat.value !== null && stat.value !== undefined;
  return hasData ? <StatWithData stat={stat} /> : <StatEmpty stat={stat} />;
}

const DEFAULT_STATS: Stat[] = [
  { label: "Quests Completed", value: null },
  { label: "Oracle Accuracy", value: null, suffix: "%", decimals: 1 },
  { label: "Active Agents", value: null },
  { label: "Total Bounties Paid", value: null, suffix: " STX" },
];

export default function ProtocolStats({ stats }: ProtocolStatsProps) {
  const displayStats = stats ?? DEFAULT_STATS;
  const hasAnyData = displayStats.some((s) => s.value !== null && s.value !== undefined);

  return (
    <section className="border-t border-b border-border bg-panel/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {!hasAnyData ? (
            <div className="col-span-full text-center py-8">
              <p className="text-zinc-500 text-sm font-medium mb-1">Protocol Launching Soon</p>
              <p className="data-label text-zinc-600">On-chain metrics will appear here once mainnet deployment is complete.</p>
            </div>
          ) : (
            displayStats.map((stat) => (
              <StatCell key={stat.label} stat={stat} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
