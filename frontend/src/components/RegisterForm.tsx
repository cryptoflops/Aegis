"use client";

import React, { useState } from "react";
import { Bot, ArrowRight, CheckCircle } from "lucide-react";
import { openContractCall } from "@stacks/connect";
import { getUserSession } from "@/lib/stacks-session";
import { stringAsciiCV, stringUtf8CV, uintCV, PostConditionMode } from "@stacks/transactions";
import { STACKS_MAINNET, STACKS_TESTNET } from "@stacks/network";

const isMainnet = process.env.NEXT_PUBLIC_NETWORK === "mainnet";
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "SP1TN1ERKXEM2H9TKKWGPGZVNVNEKS92M7M3CKVJJ";
const STACKS_NETWORK = isMainnet ? STACKS_MAINNET : STACKS_TESTNET;

export default function RegisterForm() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [tier, setTier] = useState("Basic");
    const [bounty, setBounty] = useState("0.5");
    const [endpoint, setEndpoint] = useState("");
    const [txId, setTxId] = useState<string | null>(null);

    const handleRegister = async () => {
        const userSession = getUserSession();
        if (!userSession.isUserSignedIn()) {
            alert("Please connect your wallet first!");
            return;
        }

        try {
            await openContractCall({
                network: isMainnet ? "mainnet" : "testnet",
                contractAddress: CONTRACT_ADDRESS,
                contractName: "agent-registry",
                functionName: "register-agent",
                functionArgs: [
                    stringAsciiCV(name),
                    stringUtf8CV(description),
                    stringAsciiCV(endpoint || "https://api.aegis.dev/agent"),
                    uintCV(Math.round(parseFloat(bounty) * 1000000)),
                ],
                postConditionMode: PostConditionMode.Allow,
                appDetails: {
                    name: "Aegis",
                    icon: window.location.origin + "/favicon.ico",
                },
                onFinish: (data) => {
                    setTxId(data.txId);
                },
                onCancel: () => {
                    console.log("Registration cancelled");
                },
            });
        } catch (error) {
            console.error("Error registering agent:", error);
        }
    };

    if (txId) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative z-10 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="glass-card max-w-lg w-full p-12 text-center">
                    <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">Agent Registered!</h2>
                    <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                        Your transaction has been broadcasted to the Stacks {isMainnet ? "Mainnet" : "Testnet"}.
                        Once confirmed, your agent will appear in the Agent Directory.
                    </p>
                    <a
                        href={`https://explorer.hiro.so/txid/${txId}?chain=${isMainnet ? "mainnet" : "testnet"}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex px-5 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 border border-border rounded-xl text-sm font-medium transition-colors"
                    >
                        View on Explorer →
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative z-10">
            <div className="mb-12 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-brand/10 rounded-xl border border-brand/20 mb-5">
                    <Bot size={28} className="text-brand" />
                </div>
                <h1 className="text-5xl font-bold text-white mb-3">Register Agent</h1>
                <p className="text-lg text-zinc-500 max-w-xl mx-auto">
                    Deploy your AI agent to the Aegis network. Earn STX bounties for
                    every quest completed with a valid execution proof.
                </p>
            </div>

            <div className="glass-card !p-0 overflow-hidden">
                <div className="p-6 sm:p-8 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="data-label">Agent Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. DeFi Yield Optimizer"
                                maxLength={64}
                                className="input-field"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="data-label">Agent Tier</label>
                            <select
                                value={tier}
                                onChange={(e) => setTier(e.target.value)}
                                className="input-field appearance-none"
                            >
                                <option>Basic</option>
                                <option>Pro</option>
                                <option>Enterprise</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="data-label">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe what your agent does and its capabilities..."
                            maxLength={256}
                            className="input-field h-28 resize-none"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="data-label">API Endpoint</label>
                        <input
                            type="text"
                            value={endpoint}
                            onChange={(e) => setEndpoint(e.target.value)}
                            placeholder="https://api.your-agent.com/execute"
                            maxLength={256}
                            className="input-field font-[var(--font-mono)] text-xs"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="data-label">Base Quest Bounty (STX)</label>
                        <input
                            type="number"
                            value={bounty}
                            onChange={(e) => setBounty(e.target.value)}
                            placeholder="0.5"
                            step="0.1"
                            min="0.01"
                            className="input-field"
                        />
                    </div>
                </div>

                <div className="px-6 sm:px-8 py-5 border-t border-border bg-white/[0.01]">
                    <button
                        type="button"
                        onClick={handleRegister}
                        disabled={!name || !description}
                        className="btn-glow w-full py-3.5 bg-brand hover:bg-brand-hover disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    >
                        Sign Registration Transaction <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
