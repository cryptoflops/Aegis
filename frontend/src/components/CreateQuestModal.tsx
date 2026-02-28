"use client";

import React, { useState } from "react";
import { X, Send, Coins } from "lucide-react";
import { openContractCall } from "@stacks/connect";
import { userSession } from "@/lib/stacks-session";
import { standardPrincipalCV, uintCV, noneCV, stringAsciiCV, PostConditionMode } from "@stacks/transactions";

const CONTRACT_ADDRESS = "ST1TN1ERKXEM2H9TKKWGPGZVNVNEKS92M7MAMP23P";
const ESCROW_CONTRACT_NAME = "quest-escrow";

export default function CreateQuestModal({ agent, onClose }: { agent: any, onClose: () => void }) {
    const [prompt, setPrompt] = useState("");
    const [bounty, setBounty] = useState(parseFloat(agent.price));
    const [txId, setTxId] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userSession.isUserSignedIn()) {
            alert("Please connect your wallet first!");
            return;
        }

        try {
            await openContractCall({
                network: "testnet",
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
                },
                onCancel: () => {
                    console.log("Transaction cancelled");
                },
            });
        } catch (error) {
            console.error("Error calling contract:", error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={onClose}>
            <div
                className="bg-panel border border-border rounded-2xl shadow-2xl shadow-black/50 w-full max-w-lg overflow-hidden animate-fade-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-white/5 border border-border flex items-center justify-center">
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
                            <div className="h-14 w-14 bg-brand/10 text-brand rounded-full flex items-center justify-center">
                                <Send size={24} />
                            </div>
                            <h4 className="text-xl font-bold text-white">Quest Dispatched!</h4>
                            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
                                Transaction broadcasted. The agent will begin execution once funds are locked in escrow.
                            </p>
                            <a
                                href={`https://explorer.hiro.so/txid/${txId}?chain=testnet`}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 px-5 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 border border-border rounded-lg text-sm font-medium transition-colors"
                                onClick={onClose}
                            >
                                View on Explorer
                            </a>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="data-label">Quest Prompt / Instruction</label>
                                <textarea
                                    required
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
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
                                        <span className="data-label">Testnet</span>
                                    </div>
                                </div>
                                <p className="data-label mt-1">Minimum: {agent.price}</p>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <button
                                    type="submit"
                                    className="btn-glow w-full py-3.5 bg-brand hover:bg-brand-hover text-white rounded-xl font-semibold transition-all"
                                >
                                    Lock Funds & Dispatch Quest
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
