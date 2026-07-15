"use client";

import { useState, useEffect, useRef } from "react";

interface Metric {
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
}

const METRICS: Metric[] = [
  { label: "Quests Completed", value: "1,436" },
  { label: "Oracle Accuracy", value: "99.4", suffix: "%" },
  { label: "Active Agents", value: "147" },
  { label: "Total Bounties Paid", value: "2,891", suffix: " STX" },
];

/* ─── Animated counter for live data ─── */
function useCountUp(target: number, duration = 2000, enabled = true) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!enabled) return;
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
            setValue(Number((eased * target).toFixed(0)));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, enabled]);

  return { value, ref };
}

function MetricCell({
  label,
  value,
  prefix,
  suffix,
}: {
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
}) {
  const numericValue = parseFloat(value.replace(/,/g, ""));
  const isNumeric = !isNaN(numericValue);
  const { value: animatedValue, ref } = useCountUp(
    isNumeric ? numericValue : 0,
    2000,
    isNumeric
  );

  return (
    <div
      ref={ref}
      className="p-6 text-center sm:text-left border-r border-border last:border-r-0"
    >
      <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className="text-3xl sm:text-4xl font-bold text-white tabular-nums tracking-tight">
        {prefix ?? ""}
        {isNumeric ? animatedValue.toLocaleString() : value}
        {suffix ?? ""}
      </p>
    </div>
  );
}

export default function MetricBar() {
  return (
    <section className="border-b border-border bg-panel/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4">
          {METRICS.map((metric) => (
            <MetricCell key={metric.label} {...metric} />
          ))}
        </div>
      </div>
    </section>
  );
}
