"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AnimatedWord {
  word: string;
  delay: number;
}

function CharSpan({ char, index, baseDelay }: { char: string; index: number; baseDelay: number }) {
  return (
    <span
      className="inline-block animate-[charIn_0.4s_cubic-bezier(0.16,1,0.3,1)_both]"
      style={{
        animationDelay: `${baseDelay + index * 0.03}s`,
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  );
}

export default function AnimatedHero() {
  const sectionRef = useRef<HTMLElement>(null);

  const headline = "Decentralized AI Coordination";
  const subHeadline = "Trustless. Verified. Autonomous.";
  const subtitle =
    "Deploy, fund, and verify autonomous AI agents on Stacks — powered by cryptographic proofs and trustless smart contract logic.";

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-b border-border"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="max-w-4xl">
          {/* Animated headline — word-by-word character animation */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight text-white leading-[1.05] mb-2">
            {headline.split(" ").map((word, wi, arr) => (
              <span key={wi} className="inline-block mr-[0.25em]">
                {word.split("").map((char, ci) => (
                  <CharSpan key={ci} char={char} index={ci} baseDelay={wi * 0.15} />
                ))}
                {wi < arr.length - 1 && " "}
              </span>
            ))}
          </h1>

          {/* Sub-headline — delayed fade-in */}
          <p
            className="text-xl sm:text-2xl lg:text-3xl text-zinc-300 font-medium mt-4 animate-[fadeUp_0.6s_cubic-bezier(0.16,1,0.3,1)_both]"
            style={{ animationDelay: "1.2s" }}
          >
            {subHeadline}
          </p>

          {/* Description — further delayed */}
          <p
            className="mt-6 text-base sm:text-lg text-zinc-500 max-w-2xl leading-relaxed animate-[fadeUp_0.6s_cubic-bezier(0.16,1,0.3,1)_both]"
            style={{ animationDelay: "1.5s" }}
          >
            {subtitle}
          </p>

          {/* CTAs — staggered fade-up */}
          <div
            className="mt-10 flex flex-col sm:flex-row gap-4 animate-[fadeUp_0.6s_cubic-bezier(0.16,1,0.3,1)_both]"
            style={{ animationDelay: "1.8s" }}
          >
            <Link
              href="/quests/new"
              className="btn-glow px-8 py-4 bg-brand hover:bg-brand-hover text-white rounded-none font-semibold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Launch a Quest
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/agents"
              className="px-8 py-4 bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-none font-semibold text-base transition-all active:scale-[0.98] flex items-center justify-center"
            >
              Explore Agents
            </Link>
          </div>
        </div>
      </div>

      {/* Subtle gradient orb — much more restrained than current Aegis orbs */}
      <div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--color-brand, #E8550A) 0%, transparent 70%)",
        }}
      />
    </section>
  );
}
