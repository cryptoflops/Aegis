"use client";

import React, { useState } from "react";
import { X, Send, Coins } from "lucide-react";
import { openContractCall } from "@stacks/connect";
import { getUserSession } from "@/lib/stacks-session";
import { standardPrincipalCV, uintCV, noneCV, stringAsciiCV, PostConditionMode } from "@stacks/transactions";
import { STACKS_MAINNET, STACKS_TESTNET } from "@stacks/network";

const isMainnet = process.env.NEXT_PUBLIC_NETWORK === "mainnet";
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "SP1TN1ERKXEM2H9TKKWGPGZVNVNEKS92M7M3CKVJJ";
const ESCROW_CONTRACT_NAME = "quest-escrow";
const STACKS_NETWORK = isMainnet ? STACKS_MAINNET : STACKS_TESTNET;

export default function CreateQuestModal({ agent, onClose }: { agent: any, onClose: () => void }) {
    const [prompt, setPrompt] = useState("");
    const [bounty, setBounty] = useState(parseFloat(agent.price));
    const [txId, setTxId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userSession = getUserSession();
        if (!userSession.isUserSignedIn()) {
            setError("Please connect your wallet first.");
            return;
        }

        setSubmitting(true);
        setError(null);
        try {
            await openContractCall({
                network: isMainnet ? "mainnet" : "testnet",
                contractAddress: CONTRACT_ADDRESS,
                contractName: ESCROW_CONTRACT_NAME,
                functionName: "create-quest",
                functionArgs: [
                    standardPrincipalCV("ST1TN1ERKXEM2H9TKKWGPGZVNVNEKS92M7MAMP23P"),
                    uintCV(agent.id),
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
                        agentName: agent.name,
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
        } catch (err: any) {
            console.error("Error calling contract:", err);
            setError(err?.message || "Transaction failed. Please try again.");
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={onClose}>
            <div
                className="bg-panel/80 backdrop-blur-xl border border-border rounded-none shadow-2xl shadow-black/50 w-full max-w-lg overflow-hidden animate-fade-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-none bg-white/5 border border-border flex items-center justify-center">
                            {agent.icon}
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white">Fund Quest</h3>
                            <p className="data-label">{agent.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors p-1">
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {txId ? (
                        <div className="flex flex-col items-center justify-center text-center py-6 space-y-4">
                            <div className="h-14 w-14 bg-brand/10 text-brand rounded-none flex items-center justify-center">
                                <Send size={24} />
                            </div>
                            <h4 className="text-xl font-bold text-white">Quest Dispatched!</h4>
                            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
                                Transaction broadcasted. The agent will begin execution once funds are locked in escrow.
                            </p>
                            <a
                                href={`https://explorer.hiro.so/txid/${txId}?chain=${isMainnet ? "mainnet" : "testnet"}`}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 px-5 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 border border-border rounded-none text-sm font-medium transition-all active:scale-[0.98]"
                                onClick={onClose}
                            >
                                View on Explorer
                            </a>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <label className="data-label">Quest Prompt / Instruction</label>
                                <textarea
                                    required
                                    value={prompt}
                                    onChange={(e) => { setPrompt(e.target.value); setError(null); }}
                                    placeholder="E.g. Analyze the contract at SP... for reentrancy vulnerabilities and return a JSON report."
                                    className="input-field h-28 resize-none"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="data-label">Bounty Escrow (STX)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Coins size={14} className="text-zinc-600" />
                                    </div>
                                    <input
                                        type="number"
                                        required
                                        min={parseFloat(agent.price)}
                                        step="0.01"
                                        value={bounty}
                                        onChange={(e) => setBounty(Number(e.target.value))}
                                        className="input-field !pl-9"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                                        <span className="data-label">{isMainnet ? "Mainnet" : "Testnet"}</span>
                                    </div>
                                </div>
                                <p className="data-label mt-1">Minimum: {agent.price}</p>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-glow w-full py-3.5 bg-brand hover:bg-brand-hover disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-none font-semibold transition-all active:scale-[0.98]"
                                >
                                    {submitting ? "Processing..." : "Lock Funds & Dispatch Quest"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
