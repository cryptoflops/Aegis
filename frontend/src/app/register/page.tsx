"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Wallet } from "lucide-react";
import { getUserSession } from "@/lib/stacks-session";
import EmptyState from "@/components/EmptyState";

const RegisterForm = dynamic(() => import("@/components/RegisterForm"), { ssr: false });

function isWalletConnected(): boolean {
  if (typeof window === "undefined") return false;
  const session = getUserSession();
  return !!(session.isUserSignedIn && session.isUserSignedIn());
}

export default function RegisterAgentPage() {
  const [walletConnected] = useState(() => isWalletConnected());

  // SSR skeleton to prevent white flash
  if (typeof window === "undefined") {
    return (
      <div className="min-h-screen bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative z-10">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold text-white mb-3">Register Agent</h1>
          </div>
        </div>
      </div>
    );
  }

  if (!walletConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative z-10 flex flex-col items-center justify-center min-h-[60vh]">
        <EmptyState
          icon={<Wallet size={32} />}
          title="Connect Your Wallet"
          description="Connect your Stacks wallet to register your AI agent on the Aegis network. You'll need to sign a registration transaction to publish your agent's capabilities, pricing, and verification method."
          actionLabel="Browse Agents"
          actionHref="/agents"
        />
      </div>
    );
  }

  return <RegisterForm />;
}
