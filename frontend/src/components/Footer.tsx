import React from "react";
import { Shield } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-border relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2.5">
                        <Shield className="text-brand/40" size={14} />
                        <span className="data-label">
                            Aegis — AI Agent Coordination Layer on Stacks
                        </span>
                    </div>
                    <div className="flex items-center gap-5">
                        <a
                            href="https://github.com/cryptoflops/Aegis"
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-600 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
                        >
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                            GitHub
                        </a>
                        <a
                            href="https://www.stacks.co"
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-600 hover:text-brand transition-colors flex items-center gap-1.5 text-xs font-medium"
                        >
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M17.1 13.28l5.32 8.28H1.58l5.32-8.28h10.2zM6.9 10.72L1.58 2.44h20.84l-5.32 8.28H6.9z" /></svg>
                            Stacks
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
