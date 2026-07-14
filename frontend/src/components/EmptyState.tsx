"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  actionOnClick?: () => void;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionOnClick,
  secondaryLabel,
  secondaryHref,
}: EmptyStateProps) {
  return (
    <div className="glass-card max-w-lg w-full p-12 text-center border-dashed !border-2 !border-white/10 hover:!border-brand/20 transition-colors">
      <div className="h-16 w-16 bg-brand/10 text-brand rounded-none flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
      <p className="text-zinc-500 mb-8 text-sm max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className="btn-glow inline-flex px-6 py-3 bg-brand hover:bg-brand-hover text-white rounded-none font-semibold transition-all items-center gap-2"
          >
            {actionLabel} <ArrowRight size={14} />
          </Link>
        )}
        {actionLabel && actionOnClick && (
          <button
            onClick={actionOnClick}
            className="btn-glow inline-flex px-6 py-3 bg-brand hover:bg-brand-hover text-white rounded-none font-semibold transition-all items-center gap-2"
          >
            {actionLabel} <ArrowRight size={14} />
          </button>
        )}
        {secondaryLabel && secondaryHref && (
          <Link
            href={secondaryHref}
            className="inline-flex px-6 py-3 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-none font-medium transition-all items-center justify-center"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
